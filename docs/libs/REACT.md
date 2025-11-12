# React

React is a JavaScript library for building user interfaces with a component-based architecture.

**Version**: 19.2.0
**Official Documentation**: https://react.dev
**Context7 Library ID**: `/websites/react_dev`

## Overview

React is the core UI library used throughout this project. Key features include:

- **Component-Based Architecture**: Build encapsulated components
- **Hooks**: Manage state and side effects in functional components
- **Virtual DOM**: Efficient rendering and updates
- **JSX**: JavaScript syntax extension for writing component markup
- **Context API**: Share state across component trees

## Key Hooks

### useState

Manage component state:

```javascript
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### useEffect

Handle side effects:

```javascript
import { useEffect, useState } from 'react'

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId)
    connection.connect()

    return () => {
      connection.disconnect()
    }
  }, [roomId])

  return <h1>Welcome to {roomId}!</h1>
}
```

### useContext

Access context values:

```javascript
import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'

function Button() {
  const theme = useContext(ThemeContext)
  return <button className={theme}>Click me</button>
}
```

### useReducer

Manage complex state logic:

```javascript
import { useReducer } from 'react'

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added':
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }]
    case 'changed':
      return tasks.map(t =>
        t.id === action.task.id ? action.task : t
      )
    case 'deleted':
      return tasks.filter(t => t.id !== action.id)
    default:
      throw Error('Unknown action: ' + action.type)
  }
}

function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    })
  }

  return (/* JSX */)
}
```

## State Management Patterns

### Lifting State Up

Share state between components by moving it to their common parent:

```javascript
function Toggle({ isOn, onChange }) {
  return (
    <button onClick={() => onChange(!isOn)}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  )
}

function Parent() {
  const [isOn, setIsOn] = useState(false)

  return <Toggle isOn={isOn} onChange={setIsOn} />
}
```

### Context + Reducer

Combine Context and Reducer for complex state management:

```javascript
import { createContext, useReducer, useContext } from 'react'

const TasksContext = createContext(null)
const TasksDispatchContext = createContext(null)

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  )
}

export function useTasks() {
  return useContext(TasksContext)
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext)
}
```

## Custom Hooks

Create reusable stateful logic:

```javascript
import { useState, useEffect } from 'react'

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }
    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Usage
function StatusBar() {
  const isOnline = useOnlineStatus()
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>
}
```

## Component Patterns

### Controlled Components

Components where parent controls the state:

```javascript
function Form() {
  const [email, setEmail] = useState('')

  return (
    <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  )
}
```

### Compound Components

Components that work together:

```javascript
function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isActive: index === activeTab,
          onClick: () => setActiveTab(index)
        })
      )}
    </div>
  )
}
```

## Performance Optimization

### React.memo

Prevent unnecessary re-renders:

```javascript
import { memo } from 'react'

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // Only re-renders when data changes
  return <div>{/* Render data */}</div>
})
```

### useMemo

Memoize expensive calculations:

```javascript
import { useMemo } from 'react'

function TodoList({ todos, filter }) {
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => todo.category === filter)
  }, [todos, filter])

  return <ul>{/* Render filteredTodos */}</ul>
}
```

### useCallback

Memoize function references:

```javascript
import { useCallback } from 'react'

function Parent() {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, [])

  return <Child onClick={handleClick} />
}
```

## Common Patterns in This Project

### Form Handling

```javascript
function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle submission
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      {/* More inputs */}
    </form>
  )
}
```

### Loading States

```javascript
function DataComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
      .then(data => setData(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>{/* Render data */}</div>
}
```

## Important Rules

- **Don't mutate state directly**: Always use the setter function
- **Effects should be pure**: No side effects during render
- **Keep components pure**: Same props should always produce the same output
- **Don't call Hooks conditionally**: Always call Hooks at the top level

## Resources

- [React Documentation](https://react.dev)
- [Hooks Reference](https://react.dev/reference/react)
- [Learn React](https://react.dev/learn)
- [React API Reference](https://react.dev/reference/react)
