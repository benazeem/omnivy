import { NextResponse } from 'next/server'
import { getSessionWithFallback } from '@/auth'
import { db } from '@/lib/database'
import { isOriginAllowed } from '@/lib/extensionAuth'
import { encrypt, decrypt } from '@/lib/encryption'
import { GoogleDriveProvider } from '@/lib/oauth/GoogleDriveProvider'
import { OneDriveProvider } from '@/lib/oauth/OneDriveProvider'
import { DropboxProvider } from '@/lib/oauth/DropboxProvider'
import { NotionProvider } from '@/lib/oauth/NotionProvider'

const PROVIDERS: Record<string, any> = {
  gdrive: new GoogleDriveProvider(),
  onedrive: new OneDriveProvider(),
  dropbox: new DropboxProvider(),
  notion: new NotionProvider(),
}

export async function GET(request: Request) {
  try { 
    const origin = request.headers.get('origin')
    if (!isOriginAllowed(origin)) {
      return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 })
    }

    const session = await getSessionWithFallback()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const { searchParams } = new URL(request.url)
    const providerParam = searchParams.get('provider')
 
    const whereClause: any = { userId, status: 'active' }
    if (providerParam) {
      whereClause.provider = providerParam
    }

    const connections = await db.providerConnection.findMany({
      where: whereClause,
      include: { encryptedToken: true },
    })

    const foldersByProvider: Record<string, any[]> = {}
 
    for (const connection of connections) {
      const provider = connection.provider
      const providerClient = PROVIDERS[provider]

      if (!providerClient) continue

      try { 
        const encryptedToken = connection.encryptedToken
        if (!encryptedToken) continue
 
        let accessToken = decrypt(
          encryptedToken.encryptedAccessToken,
          encryptedToken.iv,
          encryptedToken.tag,
        )
 
        const performFetch = async (tokenToUse: string) => {
          if (provider === 'gdrive') {
            return await fetchGoogleDriveFolders(tokenToUse)
          } else if (provider === 'onedrive') {
            return await fetchOneDriveFolders(tokenToUse)
          } else if (provider === 'dropbox') {
            return await fetchDropboxFolders(tokenToUse)
          } else if (provider === 'notion') {
            const userDestinations = await db.providerDestination.findMany({
              where: { userId: userId, provider: 'notion' },
            })
            return userDestinations.map((d: any) => ({
              id: `${d.resourceType}:${d.resourceId}`,
              name: d.name,
            }))
          }
          return []
        }

        let folders: any[] = []
        try {
          folders = await performFetch(accessToken)
        } catch (fetchError) {
          console.warn(
            `Initial fetch failed for ${provider}, attempting token refresh:`,
            fetchError,
          )
 
          if (encryptedToken.encryptedRefreshToken) {
            let decryptedRefreshToken = ''
            const parts = encryptedToken.encryptedRefreshToken.split(':')

            if (parts.length === 3) {
              const [rIv, rTag, rData] = parts
              decryptedRefreshToken = decrypt(rData, rIv, rTag)
            } else {
              decryptedRefreshToken = decrypt(
                encryptedToken.encryptedRefreshToken,
                encryptedToken.iv,
                encryptedToken.tag,
              )
            }
 
            const freshTokens = await providerClient.refreshToken(
              decryptedRefreshToken,
            )
 
            const {
              encryptedData: encAccess,
              iv,
              tag,
            } = encrypt(freshTokens.accessToken)
            let encRefresh = encryptedToken.encryptedRefreshToken
            if (freshTokens.refreshToken) {
              const r = encrypt(freshTokens.refreshToken)
              encRefresh = `${r.iv}:${r.tag}:${r.encryptedData}`
            }
 
            await db.encryptedToken.update({
              where: { connectionId: connection.id },
              data: {
                encryptedAccessToken: encAccess,
                encryptedRefreshToken: encRefresh,
                iv,
                tag,
                expiresAt: freshTokens.expiresAt,
              },
            })
 
            accessToken = freshTokens.accessToken
            folders = await performFetch(accessToken)
          } else {
            throw fetchError
          }
        }

        foldersByProvider[provider] = folders
      } catch (providerError) {
        console.warn(`Failed to fetch folders for ${provider}:`, providerError)
        foldersByProvider[provider] = []
      }
    }

    return NextResponse.json({ success: true, folders: foldersByProvider })
  } catch (error: any) {
    console.error('Folder fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch folders' },
      { status: 500 },
    )
  }
}

async function fetchGoogleDriveFolders(accessToken: string): Promise<any[]> {
  type DriveFolderRecord = {
    id: string
    name: string
    parents?: string[]
    ownedByMe?: boolean
    capabilities?: {
      canAddChildren?: boolean
      canEdit?: boolean
    }
  }

  type DriveFolderNode = DriveFolderRecord & {
    parentId: string | null
    path: string
    folders: DriveFolderNode[]
  }

  async function fetchAllFolders(): Promise<DriveFolderRecord[]> {
    const allFolders: DriveFolderRecord[] = []
    let pageToken: string | undefined

    do {
      const query = [
         "mimeType='application/vnd.google-apps.folder'",
         'trashed=false',
         "'me' in owners",
      ].join(' and ')
      const url = new URL('https://www.googleapis.com/drive/v3/files')
      url.searchParams.set('q', query)
      url.searchParams.set('pageSize', '1000')
       url.searchParams.set(
        'fields',
        'files(id,name,parents,ownedByMe,capabilities/canAddChildren,capabilities/canEdit),nextPageToken',
      )
       url.searchParams.set('corpora', 'user')
       url.searchParams.set('includeItemsFromAllDrives', 'false')
      url.searchParams.set('supportsAllDrives', 'false')
       url.searchParams.set('spaces', 'drive')
      if (pageToken) url.searchParams.set('pageToken', pageToken)

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!res.ok) {
        throw new Error(`Google Drive API error: ${res.status} ${await res.text()}`)
      }

      const data = await res.json()
      allFolders.push(
        ...(data.files || []).filter((folder: DriveFolderRecord) => {
           if (!folder.ownedByMe) return false

           return folder.capabilities?.canAddChildren === true
        }),
      )
      pageToken = data.nextPageToken
    } while (pageToken)

    return allFolders
  }

  const folders = await fetchAllFolders()

  const nodeMap = new Map<string, DriveFolderNode>()
  for (const folder of folders) {
    nodeMap.set(folder.id, {
      ...folder,
      parentId: folder.parents?.[0] || null,
      path: '',
      folders: [],
    })
  }

  const attached = new Set<string>()
  for (const folder of folders) {
    const node = nodeMap.get(folder.id)
    if (!node) continue

    const parentId = folder.parents?.find((candidate) => nodeMap.has(candidate))
    if (!parentId) continue

    const parent = nodeMap.get(parentId)
    if (!parent) continue

    parent.folders.push(node)
    attached.add(folder.id)
  }

  const assignPaths = (
    nodes: DriveFolderNode[],
    parentPath = '',
  ): DriveFolderNode[] =>
    nodes.map((node) => {
      const path = parentPath ? `${parentPath}/${node.name}` : `/${node.name}`
      return {
        ...node,
        path,
        folders: assignPaths(node.folders, path),
      }
    })

  const roots = [...nodeMap.values()].filter((node) => !attached.has(node.id))
  return assignPaths(roots)
}

async function fetchOneDriveFolders(accessToken: string): Promise<any[]> {
  const filter = encodeURIComponent('folder ne null')
  const select = encodeURIComponent('id,name,folder,parentReference')
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/drive/root/children?$filter=${filter}&$select=${select}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )

  if (!res.ok) {
    throw new Error(`OneDrive API error: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  return (data.value || []).map((folder: any) => ({
    id: folder.id,
    name: folder.name,
    folder: folder.folder || null,
    parentReference: folder.parentReference || null,
  }))
}

async function fetchDropboxFolders(accessToken: string): Promise<any[]> {
  const res = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path: '' }),
  })

  if (!res.ok) {
    throw new Error(`Dropbox API error: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  return (data.entries || [])
    .filter((entry: any) => entry['.tag'] === 'folder')
    .map((folder: any) => ({
      id: folder.id,
      name: folder.name,
      path: folder.path_display,
    }))
}
