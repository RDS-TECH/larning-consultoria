# Next.js

Next.js is a React framework for building full-stack web applications. It provides powerful features like server-side rendering, static site generation, API routes, and more.

**Version**: 16.0.1
**Official Documentation**: https://nextjs.org/docs
**Context7 Library ID**: `/vercel/next.js`

## Overview

Next.js is the main framework used in this project for building the frontend application. It provides:

- **App Router**: File-based routing system with React Server Components
- **Server Components**: React components that run on the server
- **API Routes**: Backend API endpoints within the Next.js application
- **Data Fetching**: Built-in methods for fetching data on the server or client
- **Image Optimization**: Automatic image optimization with the `next/image` component

## Key Concepts

### Server Components

Server Components allow you to fetch data directly within components on the server:

```tsx
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### Data Fetching Strategies

Next.js provides different caching strategies for `fetch()`:

```tsx
// Static (cached indefinitely) - similar to getStaticProps
const staticData = await fetch('https://...', { cache: 'force-cache' })

// Dynamic (refetch on every request) - similar to getServerSideProps
const dynamicData = await fetch('https://...', { cache: 'no-store' })

// Revalidated (cached with lifetime) - similar to ISR
const revalidatedData = await fetch('https://...', { next: { revalidate: 10 } })
```

### Dynamic Route Parameters

Access route parameters using the `params` prop (Note: In Next.js 16, params is a Promise):

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <h1>Blog Post: {slug}</h1>
}
```

### API Routes

Create API endpoints using Route Handlers in the `app` directory:

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const data = await fetchUsers()
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  // Process the data
  return NextResponse.json({ success: true })
}
```

### Link Component

Use the `Link` component for client-side navigation with automatic prefetching:

```tsx
import Link from 'next/link'

export default function Nav() {
  return (
    <nav>
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>
    </nav>
  )
}
```

## Common Patterns in This Project

### Async Params Handling (Next.js 16)

In Next.js 16, route params are now Promises and must be unwrapped using `React.use()`:

```tsx
import { use } from 'react'

function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  // Use id...
}
```

### Server-Side Data Fetching

Fetch data directly in Server Components without additional API routes:

```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // Revalidate every hour
  })
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <div>{/* Render data */}</div>
}
```

### Responsive Design Configuration

Set the viewport meta tag in your root layout:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

## Performance Optimization

- Use `dynamic = 'force-static'` to force static rendering
- Use `revalidate` with `fetch()` for ISR (Incremental Static Regeneration)
- Implement proper loading and error states with `loading.tsx` and `error.tsx`
- Use React Suspense for streaming server rendering

## Migration from Pages Router

If migrating from the Pages Router:

- `getServerSideProps` → Server Component with `fetch({ cache: 'no-store' })`
- `getStaticProps` → Server Component with `fetch({ cache: 'force-cache' })`
- `getStaticPaths` → Use `generateStaticParams()` function
- API Routes → Move to `app/api` directory with Route Handlers

## Important Notes

- Always use Server Components by default unless you need client-side interactivity
- Use `'use client'` directive only when necessary (for hooks, event handlers, etc.)
- Keep client components small and focused
- Server Components cannot use React hooks like `useState` or `useEffect`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Routing](https://nextjs.org/docs/app/building-your-application/routing)
