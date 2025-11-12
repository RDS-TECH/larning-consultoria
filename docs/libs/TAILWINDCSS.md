# Tailwind CSS

Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.

**Version**: 4.x
**Official Documentation**: https://tailwindcss.com
**Context7 Library ID**: `/websites/tailwindcss`

## Overview

Tailwind CSS is used throughout this project for styling. Key features:

- **Utility-First**: Build complex designs using utility classes
- **Responsive Design**: Built-in responsive modifiers
- **Customizable**: Easily extend or modify the default design system
- **Performance**: Automatically removes unused CSS in production
- **Modern CSS**: Supports modern features like Grid, Flexbox, and CSS Variables

## Core Concepts

### Utility Classes

Tailwind provides thousands of utility classes for styling:

```html
<div class="bg-blue-500 text-white p-4 rounded-lg shadow-md">
  Hello World
</div>
```

Common patterns:
- `p-4` - padding: 1rem
- `m-2` - margin: 0.5rem
- `text-lg` - font-size: 1.125rem
- `bg-blue-500` - background-color: blue (500 shade)
- `rounded-lg` - border-radius: 0.5rem
- `shadow-md` - box-shadow: medium

### Responsive Design

Use responsive modifiers to apply styles at specific breakpoints:

```html
<!-- Stack on mobile, row on medium screens and up -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/2">Column 1</div>
  <div class="w-full md:w-1/2">Column 2</div>
</div>
```

Default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Hover, Focus, and Other States

Apply styles conditionally using state modifiers:

```html
<button class="bg-blue-500 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300">
  Click me
</button>

<input class="border border-gray-300 focus:border-blue-500 focus:outline-none" />
```

## Layout

### Flexbox

```html
<!-- Horizontal layout with centered items -->
<div class="flex items-center justify-center gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Vertical layout -->
<div class="flex flex-col space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Grid

```html
<!-- 3-column grid -->
<div class="grid grid-cols-3 gap-4">
  <div>Cell 1</div>
  <div>Cell 2</div>
  <div>Cell 3</div>
</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Cell 1</div>
  <div>Cell 2</div>
  <div>Cell 3</div>
</div>
```

### Container

```html
<div class="container mx-auto px-4">
  <!-- Content is centered and has responsive padding -->
</div>
```

## Typography

```html
<!-- Headings -->
<h1 class="text-4xl font-bold text-gray-900">Heading 1</h1>
<h2 class="text-3xl font-semibold text-gray-800">Heading 2</h2>

<!-- Paragraph -->
<p class="text-base text-gray-600 leading-relaxed">
  This is a paragraph with comfortable line height.
</p>

<!-- Links -->
<a href="#" class="text-blue-500 hover:text-blue-700 underline">
  Link text
</a>
```

## Colors

Tailwind provides a comprehensive color palette:

```html
<!-- Background colors -->
<div class="bg-red-500">Red</div>
<div class="bg-blue-600">Blue</div>
<div class="bg-green-700">Green</div>

<!-- Text colors -->
<p class="text-red-500">Red text</p>
<p class="text-blue-600">Blue text</p>

<!-- Border colors -->
<div class="border border-gray-300">Bordered</div>
```

Color shades range from 50 (lightest) to 950 (darkest).

## Spacing

Spacing utilities use a consistent scale:

```html
<!-- Padding -->
<div class="p-4">All sides</div>
<div class="px-4 py-2">Horizontal and vertical</div>
<div class="pt-4 pr-2 pb-4 pl-2">Individual sides</div>

<!-- Margin -->
<div class="m-4">All sides</div>
<div class="mx-auto">Centered horizontally</div>
<div class="mt-4 mb-8">Top and bottom</div>

<!-- Gap (for flex/grid) -->
<div class="flex gap-4">Items with gap</div>
<div class="grid gap-x-4 gap-y-8">Different x and y gaps</div>
```

## Sizing

```html
<!-- Width -->
<div class="w-full">100% width</div>
<div class="w-1/2">50% width</div>
<div class="w-64">16rem width</div>

<!-- Height -->
<div class="h-screen">Full viewport height</div>
<div class="h-64">16rem height</div>

<!-- Min/Max -->
<div class="min-h-screen">Minimum full height</div>
<div class="max-w-4xl">Maximum width constraint</div>
```

## Borders and Shadows

```html
<!-- Borders -->
<div class="border border-gray-300 rounded-lg">
  Bordered with rounded corners
</div>

<!-- Shadows -->
<div class="shadow-sm">Small shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-xl">Extra large shadow</div>
```

## Customization

### Extending the Theme

```css
/* In your main CSS file */
@import "tailwindcss";

@theme {
  /* Add custom colors */
  --color-brand: #00bfa5;
  --color-accent: #ff6b6b;

  /* Add custom spacing */
  --spacing-18: 4.5rem;

  /* Add custom breakpoints */
  --breakpoint-3xl: 1920px;
}
```

### Using Custom Properties

```html
<div class="bg-brand text-white">
  Custom brand color
</div>
```

## Common Component Patterns

### Button

```html
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Primary Button
</button>

<button class="bg-transparent hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded">
  Secondary Button
</button>
```

### Card

```html
<div class="bg-white rounded-lg shadow-md p-6">
  <h3 class="text-xl font-semibold mb-2">Card Title</h3>
  <p class="text-gray-600">Card content goes here.</p>
</div>
```

### Form Input

```html
<input
  type="text"
  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="Enter text"
/>
```

### Navigation Bar

```html
<nav class="bg-white shadow-md">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <div class="text-xl font-bold">Logo</div>
      <div class="flex space-x-4">
        <a href="#" class="text-gray-700 hover:text-blue-500">Home</a>
        <a href="#" class="text-gray-700 hover:text-blue-500">About</a>
        <a href="#" class="text-gray-700 hover:text-blue-500">Contact</a>
      </div>
    </div>
  </div>
</nav>
```

## Dark Mode

Tailwind supports dark mode with the `dark:` modifier:

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  This content adapts to dark mode
</div>
```

Configure dark mode in your CSS:

```css
@import "tailwindcss";

@theme {
  --color-scheme: light dark;
}
```

## Performance

### Production Build

Tailwind automatically removes unused CSS in production:

```bash
npm run build
```

### JIT Mode

Tailwind v3+ uses Just-In-Time mode by default, generating styles on-demand as you author content.

## Best Practices

1. **Use Consistent Spacing**: Stick to the default spacing scale
2. **Leverage Responsive Utilities**: Design mobile-first, then add larger breakpoints
3. **Create Components**: Extract repeated patterns into React/Vue components
4. **Use @apply Sparingly**: Prefer utility classes in HTML for better maintenance
5. **Custom Properties**: Use CSS custom properties for theming

## Common Patterns in This Project

### Responsive Grid Layout

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Grid items -->
</div>
```

### Centered Container

```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <!-- Content -->
</div>
```

### Loading Spinner

```html
<div class="flex items-center justify-center h-screen">
  <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
</div>
```

## Important Notes

- Tailwind v4 uses CSS-first configuration (no more `tailwind.config.js`)
- Always include viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Use the `@import "tailwindcss"` directive in your main CSS file
- Utilities are mobile-first by default
- Custom utilities can be created with `@utility` directive

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Customization](https://tailwindcss.com/docs/theme)
- [Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Utility-First Fundamentals](https://tailwindcss.com/docs/utility-first)
