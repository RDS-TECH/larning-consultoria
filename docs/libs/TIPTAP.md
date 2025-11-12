# Tiptap

Tiptap is a headless, framework-agnostic rich-text editor based on ProseMirror.

**Official Documentation**: https://tiptap.dev
**Context7 Library ID**: `/websites/tiptap_dev`

## Overview

Tiptap is used in this project for creating rich text editing experiences. Key features:

- **Headless**: Bring your own UI components
- **Framework Support**: Works with React, Vue, and vanilla JavaScript
- **Extensible**: Plugin-based architecture
- **Collaborative**: Real-time collaborative editing with Y.js
- **TypeScript**: Full TypeScript support

## Basic Setup (React)

### Installation

```bash
npm install @tiptap/react @tiptap/starter-kit
```

### Minimal Editor

```jsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

function Editor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
  })

  return <EditorContent editor={editor} />
}
```

## Core Extensions

### StarterKit

Bundles commonly used extensions:

```javascript
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      // Configure individual extensions
      heading: {
        levels: [1, 2, 3],
      },
      // Disable specific extensions
      undoRedo: false,
    }),
  ],
})
```

### Individual Extensions

```javascript
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'

const editor = useEditor({
  extensions: [
    Document,
    Paragraph,
    Text,
    Heading.configure({
      levels: [1, 2, 3],
    }),
  ],
})
```

## Editor Commands

### Text Formatting

```jsx
<button onClick={() => editor.chain().focus().toggleBold().run()}>
  Bold
</button>

<button onClick={() => editor.chain().focus().toggleItalic().run()}>
  Italic
</button>

<button onClick={() => editor.chain().focus().toggleStrike().run()}>
  Strike
</button>
```

### Headings

```jsx
<button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
  H1
</button>

<button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
  H2
</button>
```

### Lists

```jsx
<button onClick={() => editor.chain().focus().toggleBulletList().run()}>
  Bullet List
</button>

<button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
  Numbered List
</button>
```

### Other Commands

```jsx
<button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
  Horizontal Rule
</button>

<button onClick={() => editor.chain().focus().undo().run()}>
  Undo
</button>

<button onClick={() => editor.chain().focus().redo().run()}>
  Redo
</button>
```

## Content Management

### Set Content

```javascript
editor.commands.setContent('<p>New content</p>')

// Or use JSON
editor.commands.setContent({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Hello' }]
    }
  ]
})
```

### Get Content

```javascript
// HTML
const html = editor.getHTML()

// JSON
const json = editor.getJSON()

// Text only
const text = editor.getText()
```

### Check Active States

```javascript
// Check if a mark/node is active
editor.isActive('bold')
editor.isActive('heading', { level: 1 })
editor.isActive('link', { href: 'https://example.com' })
```

## Collaborative Editing

### Setup with Y.js

```bash
npm install @tiptap/extension-collaboration yjs y-protocols
```

```javascript
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { TiptapCollabProvider } from '@tiptap-pro/provider'

const doc = new Y.Doc()

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      undoRedo: false,  // Disable default history
    }),
    Collaboration.configure({
      document: doc,
    }),
  ],
})

// Setup provider
useEffect(() => {
  const provider = new TiptapCollabProvider({
    name: 'document-name',
    appId: 'your-app-id',
    token: 'your-token',
    document: doc,
  })

  return () => provider.destroy()
}, [])
```

### Preventing Duplicate Content

```javascript
const editor = useEditor({
  extensions: [/* extensions */],
  // Don't set content here
})

useEffect(() => {
  const provider = new TiptapCollabProvider({
    name: 'document-name',
    appId: 'your-app-id',
    token: 'your-token',
    document: doc,
    onSynced() {
      if (!doc.getMap('config').get('initialContentLoaded') && editor) {
        doc.getMap('config').set('initialContentLoaded', true)
        editor.commands.setContent('<p>Initial content</p>')
      }
    },
  })
}, [])
```

## Custom Extensions

### Creating a Custom Extension

```javascript
import { Mark } from '@tiptap/core'

const CustomHighlight = Mark.create({
  name: 'highlight',

  parseHTML() {
    return [
      {
        tag: 'mark',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', HTMLAttributes, 0]
  },

  addCommands() {
    return {
      toggleHighlight: () => ({ commands }) => {
        return commands.toggleMark(this.name)
      },
    }
  },
})
```

### Extend Existing Extension

```javascript
import Bold from '@tiptap/extension-bold'

const CustomBold = Bold.extend({
  renderHTML({ HTMLAttributes }) {
    return ['b', HTMLAttributes, 0]
  },
})
```

## Event Handling

```javascript
const editor = useEditor({
  extensions: [StarterKit],
  content: '<p>Hello</p>',
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    console.log('Content updated:', html)
  },
  onCreate: ({ editor }) => {
    console.log('Editor created')
  },
  onSelectionUpdate: ({ editor }) => {
    console.log('Selection changed')
  },
})
```

## Styling

Tiptap is headless, so you need to style the editor yourself:

```css
.ProseMirror {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 200px;
}

.ProseMirror:focus {
  outline: none;
  border-color: #3b82f6;
}

.ProseMirror h1 {
  font-size: 2rem;
  font-weight: bold;
}

.ProseMirror h2 {
  font-size: 1.5rem;
  font-weight: bold;
}

.ProseMirror ul,
.ProseMirror ol {
  padding-left: 1.5rem;
}
```

## Common Patterns

### Toolbar Component

```jsx
function Toolbar({ editor }) {
  if (!editor) return null

  return (
    <div className="toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Italic
      </button>
      {/* More buttons */}
    </div>
  )
}
```

### Controlled Editor

```jsx
function ControlledEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return <EditorContent editor={editor} />
}
```

## Important Notes

- Editor instance is `null` until initialized
- Always check `if (!editor) return null` in toolbar components
- Use `editor.chain()` to combine multiple commands
- Use `.focus()` before commands to maintain focus
- Disable default history when using Collaboration
- Clean up editor instance on unmount

## Resources

- [Tiptap Documentation](https://tiptap.dev/docs)
- [Examples](https://tiptap.dev/examples)
- [Extensions](https://tiptap.dev/docs/editor/extensions)
- [Collaboration](https://tiptap.dev/docs/collaboration/getting-started)
