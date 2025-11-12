# SWR

SWR (Stale-While-Revalidate) is a React Hooks library for data fetching.

**Official Documentation**: https://swr.vercel.app
**Context7 Library ID**: `/vercel/swr`

## Overview

SWR is used throughout this project for efficient data fetching and caching. Key features:

- **Fast, Lightweight & Reusable**: Tiny bundle size with built-in cache
- **Real-Time**: Automatic revalidation on focus, reconnection, and interval
- **JAMstack Oriented**: Works great with SSR, SSG, and ISR
- **TypeScript Ready**: Full TypeScript support
- **React Suspense**: Built-in support for React Suspense

## Basic Usage

```jsx
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then(res => res.json())

function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher)

  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  return <div>Hello {data.name}!</div>
}
```

## Configuration Options

### Global Configuration

```jsx
import { SWRConfig } from 'swr'

function App() {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => fetch(url).then(res => res.json()),
        refreshInterval: 3000,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
        onError: (error, key) => {
          console.error('SWR Error:', key, error)
        },
      }}
    >
      <Profile />
      <Dashboard />
    </SWRConfig>
  )
}
```

### Per-Hook Configuration

```jsx
const { data } = useSWR('/api/user', fetcher, {
  refreshInterval: 1000,
  revalidateOnFocus: false,
  revalidateOnMount: true,
  dedupingInterval: 2000,
})
```

## Data Mutation

### Bound Mutation

```jsx
function UserProfile({ userId }) {
  const { data, mutate } = useSWR(`/api/user/${userId}`, fetcher)

  async function updateName(newName) {
    await mutate(
      fetch(`/api/user/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: newName }),
      }).then(res => res.json()),
      {
        optimisticData: { ...data, name: newName },
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      }
    )
  }

  return <div>{/* UI */}</div>
}
```

### Global Mutation

```jsx
import { mutate } from 'swr'

async function deleteUser(userId) {
  await mutate(
    `/api/user/${userId}`,
    async () => {
      await fetch(`/api/user/${userId}`, { method: 'DELETE' })
      return undefined
    },
    {
      optimisticData: null,
      rollbackOnError: true,
      populateCache: false,
      revalidate: true,
    }
  )
}

// Mutate multiple keys
function clearUserCache() {
  mutate(
    key => typeof key === 'string' && key.startsWith('/api/user'),
    undefined,
    { revalidate: true }
  )
}
```

## Advanced Patterns

### Conditional Fetching

```jsx
function UserDashboard({ userId }) {
  // Fetch only if userId exists
  const { data: user } = useSWR(userId ? `/api/user/${userId}` : null, fetcher)

  // Fetch posts only after user data is available
  const { data: posts } = useSWR(
    user ? `/api/posts?author=${user.id}` : null,
    fetcher
  )

  if (!userId) return <div>No user selected</div>
  if (!user) return <div>Loading user...</div>

  return <div>{/* UI */}</div>
}
```

### Optimistic Updates

```jsx
function TodoList() {
  const { data: todos, mutate } = useSWR('/api/todos', fetcher)

  const addTodo = async (text) => {
    const newTodo = { id: Date.now(), text, completed: false }

    await mutate(
      fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ text }),
      }).then(res => res.json()),
      {
        optimisticData: [...todos, newTodo],
        rollbackOnError: true,
        populateCache: (serverTodo) => [...todos, serverTodo],
        revalidate: true,
      }
    )
  }

  return <div>{/* UI */}</div>
}
```

### Pagination

```jsx
import useSWRInfinite from 'swr/infinite'

function IssueList({ repo }) {
  const PAGE_SIZE = 10

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null
    return `https://api.github.com/repos/${repo}/issues?per_page=${PAGE_SIZE}&page=${pageIndex + 1}`
  }

  const { data, size, setSize, isValidating, isLoading } = useSWRInfinite(
    getKey,
    fetcher,
    { revalidateFirstPage: false }
  )

  const issues = data ? [].concat(...data) : []
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)

  return (
    <div>
      {issues.map(issue => (
        <div key={issue.id}>{issue.title}</div>
      ))}
      <button
        disabled={isLoadingMore || isReachingEnd}
        onClick={() => setSize(size + 1)}
      >
        {isLoadingMore ? 'Loading...' : isReachingEnd ? 'No more' : 'Load More'}
      </button>
    </div>
  )
}
```

### Polling

```jsx
function LiveDashboard() {
  // Poll every 5 seconds
  const { data: stats } = useSWR('/api/stats', fetcher, {
    refreshInterval: 5000,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  })

  // Dynamic polling interval
  const { data: task } = useSWR('/api/task/123', fetcher, {
    refreshInterval: (data) => {
      return data?.status === 'complete' ? 0 : 2000
    },
  })

  return <div>{/* UI */}</div>
}
```

## Special Hooks

### useSWRImmutable

For data that never changes:

```jsx
import useSWRImmutable from 'swr/immutable'

function StaticContent() {
  const { data } = useSWRImmutable('/api/config', fetcher)
  return <div>{data?.appName}</div>
}
```

### useSWRMutation

For remote mutations (POST, PUT, DELETE):

```jsx
import useSWRMutation from 'swr/mutation'

function CreateUser() {
  const { trigger, isMutating, data, error } = useSWRMutation(
    '/api/users',
    (url, { arg }) => fetch(url, {
      method: 'POST',
      body: JSON.stringify(arg),
    }).then(res => res.json()),
    {
      onSuccess: (data) => console.log('User created:', data),
      onError: (error) => console.error('Failed:', error),
    }
  )

  const handleSubmit = async (formData) => {
    await trigger({ name: formData.name, email: formData.email })
  }

  return <form onSubmit={handleSubmit}>{/* UI */}</form>
}
```

### useSWRSubscription

For real-time subscriptions (WebSockets, EventSource):

```jsx
import useSWRSubscription from 'swr/subscription'

function LivePrice({ symbol }) {
  const { data, error } = useSWRSubscription(
    `price-${symbol}`,
    (key, { next }) => {
      const ws = new WebSocket(`wss://api.example.com/prices/${symbol}`)

      ws.onmessage = (event) => {
        const price = JSON.parse(event.data)
        next(null, price)
      }

      ws.onerror = (err) => next(err)

      return () => ws.close()
    }
  )

  if (error) return <div>Connection error</div>
  if (!data) return <div>Connecting...</div>

  return <div>Price: ${data.value}</div>
}
```

## Preloading Data

```jsx
import { preload } from 'swr'

function UserCard({ userId }) {
  const handleMouseEnter = () => {
    preload(`/api/user/${userId}`, fetcher)
  }

  return (
    <Link
      to={`/profile/${userId}`}
      onMouseEnter={handleMouseEnter}
    >
      View Profile
    </Link>
  )
}
```

## Error Handling

```jsx
const { data, error } = useSWR('/api/data', fetcher, {
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    if (error.status === 404) return
    if (retryCount >= 5) return
    setTimeout(() => revalidate({ retryCount }), 1000 * Math.pow(2, retryCount))
  },
  onError: (error, key) => {
    console.error(`Error fetching ${key}:`, error)
  },
})
```

## Important Notes

- SWR deduplicates requests automatically
- Data is shared across all components using the same key
- Mutations don't trigger network requests; use `revalidate` to refetch
- `mutate()` can accept a function for optimistic updates
- Always provide a fetcher function (globally or per-hook)

## Resources

- [SWR Documentation](https://swr.vercel.app)
- [API Reference](https://swr.vercel.app/docs/api)
- [Examples](https://swr.vercel.app/examples/basic)
- [TypeScript](https://swr.vercel.app/docs/typescript)
