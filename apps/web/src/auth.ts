import NextAuth from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import { db } from './lib/database'
import { authConfig } from './auth.config'
import { decode } from 'next-auth/jwt'
import { headers } from 'next/headers'
import { verifyAccessToken } from './lib/extensionTokens'

const CustomPrismaAdapter: Adapter = {
  async createUser(user) {
    return db.user.create({
      data: {
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
      },
    })
  },
  async getUser(id) {
    return db.user.findUnique({ where: { id } })
  },
  async getUserByEmail(email) {
    return db.user.findUnique({ where: { email } })
  },
  async getUserByAccount({ provider, providerAccountId }) {
    const oauthAccount = await db.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: { user: true },
    })
    return oauthAccount?.user ?? null
  },
  async updateUser(user) {
    return db.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
      },
    })
  },
  async linkAccount(account) {
    await db.oAuthAccount.create({
      data: {
        userId: account.userId,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        type: account.type,
      },
    })
  },
  /* 
   Commented code for checking the next-auth error in Oauth flow.
  async createSession(session) {
    return db.userSession.create({
      data: {
        userId: session.userId,
        sessionToken: session.sessionToken,
        expires: session.expires,
      },
    })
  },
  async getSessionAndUser(sessionToken) {
    const userSession = await db.userSession.findUnique({
      where: { sessionToken },
      include: { user: true },
    })
    if (!userSession) return null
    return {
      session: {
        userId: userSession.userId,
        sessionToken: userSession.sessionToken,
        expires: userSession.expires,
      },
      user: userSession.user,
    }
  },
  async updateSession(session) {
    return db.userSession.update({
      where: { sessionToken: session.sessionToken },
      data: {
        expires: session.expires,
        userId: session.userId,
      },
    })
  },
  async deleteSession(sessionToken) {
    await db.userSession.deleteMany({
      where: { sessionToken },
    })
  },*/
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: CustomPrismaAdapter,
  events: {
    async signOut(message) {
      const token = 'token' in message ? message.token : null
      const userId = token?.id as string | undefined
      if (userId) {
        await db.user.update({
          where: { id: userId },
          data: { extensionTokenVersion: { increment: 1 } },
        })
      }
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }

      return token
    },
  },
})

export async function getSessionWithFallback() {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)

      const accessPayload = await verifyAccessToken(token)
      if (accessPayload?.sub) {
        const user = await db.user.findUnique({
          where: { id: accessPayload.sub, deletedAt: null },
          select: { id: true, name: true, email: true, image: true },
        })
        if (user) {
          return {
            user: {
              id: user.id,
              email: user.email ?? '',
              name: user.name ?? '',
              image: user.image ?? undefined,
            },
            expires: accessPayload.exp
              ? new Date(Number(accessPayload.exp) * 1000).toISOString()
              : '',
          }
        }
      }

      const decoded = await decode({
        token,
        secret: process.env.AUTH_SECRET!,
        salt:
          process.env.NODE_ENV === 'production'
            ? '__Secure-authjs.session-token'
            : 'authjs.session-token',
      })
      if (decoded) {
        return {
          user: {
            id: decoded.id as string,
            email: decoded.email as string,
            name: decoded.name as string,
            image: decoded.picture as string,
          },
          expires: decoded.exp
            ? new Date(Number(decoded.exp) * 1000).toISOString()
            : '',
        }
      }
    }
  } catch (error) {
    console.error('[Auth Fallback] Decryption error:', error)
  }

  const session = await auth()
  if (session) return session

  return null
}
