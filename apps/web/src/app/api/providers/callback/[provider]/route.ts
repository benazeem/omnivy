import { NextResponse } from "next/server"
import { getSessionWithFallback } from "@/auth"
import { db } from "@/lib/database"
import { encrypt } from "@/lib/encryption"
import { GoogleDriveProvider } from "@/lib/oauth/GoogleDriveProvider"
import { OneDriveProvider } from "@/lib/oauth/OneDriveProvider"
import { DropboxProvider } from "@/lib/oauth/DropboxProvider"
import { NotionProvider } from "@/lib/oauth/NotionProvider"

const PROVIDERS: Record<string, any> = {
  gdrive: new GoogleDriveProvider(),
  onedrive: new OneDriveProvider(),
  dropbox: new DropboxProvider(),
  notion: new NotionProvider(),
}

export async function GET(
  req: Request,
  props: { params: Promise<{ provider: string }> }
) {
  const params = await props.params
  const providerName = params.provider

  try { 
  const session = await getSessionWithFallback()
  if (!session || !session.user || !session.user.id) { 
    const signInUrl = new URL("/auth/signin", req.url)
    signInUrl.searchParams.set("error", "SessionExpired")

    return NextResponse.redirect(signInUrl)
  }

    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")
 
    if (error) {
      console.error(`OAuth callback returned error for ${providerName}:`, error)
      return new NextResponse(getErrorHtml(error, providerName), {
        headers: { "Content-Type": "text/html" }
      })
    }

    if (!code) {
      return new NextResponse(getErrorHtml("MissingAuthCode", providerName), {
        headers: { "Content-Type": "text/html" }
      })
    }

    const providerClient = PROVIDERS[providerName]
    if (!providerClient) {
      return new NextResponse(getErrorHtml("UnsupportedProvider", providerName), {
        headers: { "Content-Type": "text/html" }
      })
    }

    const requiredScopesByProvider: Record<string, string[]> = {
      gdrive: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
      ],
    }
 
    const tokenPayload = await providerClient.exchangeCode(code)

    const requiredScopes = requiredScopesByProvider[providerName] || []
    if (requiredScopes.length > 0) {
      const grantedScopes = new Set(tokenPayload.scopes)
      const missingScopes = requiredScopes.filter((scope) => !grantedScopes.has(scope))

      if (missingScopes.length > 0) {
        console.warn(`OAuth callback missing required scopes for ${providerName}:`, missingScopes)
        return new NextResponse(getErrorHtml('MissingRequiredScopes', providerName), {
          headers: { 'Content-Type': 'text/html' },
        })
      }
    }
 
    const encAccess = encrypt(tokenPayload.accessToken)
    let encRefresh = null
    if (tokenPayload.refreshToken) {
      const r = encrypt(tokenPayload.refreshToken)
      encRefresh = `${r.iv}:${r.tag}:${r.encryptedData}`
    } 

    const connection = await db.providerConnection.upsert({
      where: {
        userId_provider: {
          userId: session.user.id,
          provider: providerName,
        },
      },
      update: {
        status: "active",
        scopes: tokenPayload.scopes,
      },
      create: {
        userId: session.user.id,
        provider: providerName,
        status: "active",
        scopes: tokenPayload.scopes,
      },
    })
 
    await db.encryptedToken.upsert({
      where: { connectionId: connection.id },
      update: {
        encryptedAccessToken: encAccess.encryptedData,
        encryptedRefreshToken: encRefresh,
        iv: encAccess.iv,
        tag: encAccess.tag,
        expiresAt: tokenPayload.expiresAt,
      },
      create: {
        connectionId: connection.id,
        encryptedAccessToken: encAccess.encryptedData,
        encryptedRefreshToken: encRefresh,
        iv: encAccess.iv,
        tag: encAccess.tag,
        expiresAt: tokenPayload.expiresAt,
      },
    })
 
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "oauth_connect",
        details: { provider: providerName },
      },
    })
 
    const successHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Connection Successful</title>
  <style>
    body {
      background-color: #0b0f19;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      text-align: center;
    }
    .card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 40px;
      max-width: 400px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .spinner {
      border: 3px solid rgba(255, 255, 255, 0.1);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border-left-color: #3b82f6;
      animation: spin 1s linear infinite;
      margin: 0 auto 24px auto;
    }
    h2 {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.6;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h2>Connection Successful!</h2>
    <p>Finishing setting up your integration. This window will close automatically.</p>
  </div>
  <script>
    if (window.opener) {
      window.opener.postMessage({ type: 'oauth-success', provider: '${providerName}' }, '*');
      setTimeout(() => { window.close(); }, 1200);
    } else {
      window.location.href = '/settings/integrations?connect=success&service=${providerName}';
    }
  </script>
</body>
</html>
    `
    return new NextResponse(successHtml, {
      headers: { "Content-Type": "text/html" }
    })
  } catch (err: any) {
    console.error(`OAuth Callback Critical Failure for ${providerName}:`, err)
    return new NextResponse(getErrorHtml("OAuthExchangeFailed", providerName), {
      headers: { "Content-Type": "text/html" }
    })
  }
}

function getErrorHtml(errCode: string, providerName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Connection Failed</title>
  <style>
    body {
      background-color: #0b0f19;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      text-align: center;
    }
    .card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 24px;
      padding: 40px;
      max-width: 400px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .error-icon {
      font-size: 48px;
      margin-bottom: 24px;
      color: #ef4444;
    }
    h2 {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 12px;
      color: #ef4444;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="error-icon">⚠️</div>
    <h2>Connection Failed</h2>
    <p>The authorization process could not be completed (Error: ${errCode}). This window will close automatically.</p>
  </div>
  <script>
    if (window.opener) {
      window.opener.postMessage({ type: 'oauth-error', error: '${errCode}', provider: '${providerName}' }, '*');
      setTimeout(() => { window.close(); }, 2000);
    } else {
      window.location.href = '/settings/integrations?error=${errCode}';
    }
  </script>
</body>
</html>
  `
}
