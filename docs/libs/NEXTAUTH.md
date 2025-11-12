# NextAuth.js

NextAuth.js is a complete authentication solution for Next.js applications.

**Official Documentation**: https://next-auth.js.org
**Context7 Library ID**: `/nextauthjs/docs`

## Overview

NextAuth.js provides a complete authentication system for Next.js applications:

- **Flexible and Easy**: Works with any OAuth provider
- **Built for Serverless**: Optimized for serverless deployment
- **Secure by Default**: Best practices for security built-in
- **Database Integration**: Supports multiple databases via adapters
- **JWT or Database Sessions**: Choose your session strategy

## Basic Setup

### Installation

```bash
npm install next-auth
```

### API Route Configuration

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

## Client-Side Usage

### useSession Hook

```jsx
'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    return <button onClick={() => signIn()}>Sign in</button>
  }

  return (
    <div>
      <p>Signed in as {session.user.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}
```

### Protected Route

```jsx
'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return <div>Protected content</div>
}
```

## Session Strategies

### JWT Sessions

```javascript
export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
}
```

### Database Sessions

```javascript
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
}
```

## Callbacks

Callbacks allow you to customize authentication behavior:

```javascript
export const authOptions = {
  providers: [/* providers */],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Control who can sign in
      const isAllowedEmail = user.email.endsWith("@company.com")
      if (isAllowedEmail) {
        return true
      }
      return "/auth/error?error=InvalidEmail"
    },

    async redirect({ url, baseUrl }) {
      // Customize redirect behavior
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },

    async jwt({ token, user, account }) {
      // Persist data to JWT token
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      if (user) {
        token.userId = user.id
        token.role = user.role
      }
      return token
    },

    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken
      session.user.id = token.userId
      session.user.role = token.role
      session.provider = token.provider
      return session
    }
  }
}
```

## Providers

### OAuth Providers

```javascript
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
  ],
}
```

### Credentials Provider

For custom authentication (email/password, etc.):

```javascript
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Verify credentials against your database
        const user = await verifyCredentials(
          credentials.email,
          credentials.password
        )

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        }
        return null
      }
    })
  ],
}
```

## Getting JWT Token

Access JWT tokens in API routes:

```javascript
import { getToken } from "next-auth/jwt"

export async function GET(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  })

  if (!token) {
    return new Response("Unauthorized", { status: 401 })
  }

  return Response.json({ userId: token.userId })
}
```

## Server-Side Session Access

```javascript
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"

export default async function ServerComponent() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div>Not authenticated</div>
  }

  return <div>Welcome {session.user.name}</div>
}
```

## Custom Pages

```javascript
export const authOptions = {
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user'
  },
}
```

## Token Refresh

Implement OAuth token refresh:

```javascript
async function refreshAccessToken(token) {
  try {
    const url = `https://oauth2.googleapis.com/token?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
      `client_secret=${process.env.GOOGLE_CLIENT_SECRET}&` +
      `grant_type=refresh_token&` +
      `refresh_token=${token.refreshToken}`

    const response = await fetch(url, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
    })

    const refreshedTokens = await response.json()

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authOptions = {
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user: account.user,
        }
      }

      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      return refreshAccessToken(token)
    },
  },
}
```

## Environment Variables

Required environment variables:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# OAuth Providers
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Generate a secret:

```bash
openssl rand -base64 32
```

## Important Notes

- NextAuth requires `NEXTAUTH_SECRET` in production
- JWT sessions are recommended for serverless
- Use database sessions for better security and revocation
- Always verify sessions on the server side for sensitive operations
- OAuth providers require callback URL configuration

## Resources

- [NextAuth Documentation](https://next-auth.js.org)
- [Providers](https://next-auth.js.org/providers/)
- [Configuration](https://next-auth.js.org/configuration/options)
- [Callbacks](https://next-auth.js.org/configuration/callbacks)
