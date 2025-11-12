# OrgEditLanding Component i18n Migration - TODO

## Status: PARTIALLY COMPLETE

### ✅ Completed
- **OrgEditImages Component**: Fully migrated to next-intl
  - All toast messages translated
  - All UI labels, buttons, and placeholders migrated
  - Tab navigation translated
  - File upload messages with plural forms
  - Video dialog (YouTube/Loom) fully internationalized

### ⏳ Remaining: OrgEditLanding Component (1,611 lines)

The OrgEditLanding component requires comprehensive migration due to its size and complexity. This component manages the organization's landing page builder with multiple section types.

## Translation Keys Already Added

The following translation keys have been added to both `en.json` and `pt-BR.json`:

### Main Structure
- `organization.edit.landing.title` - "Landing Page" / "Página de Destino"
- `organization.edit.landing.subtitle` - "Customize your organization's landing page"
- `organization.edit.landing.beta` - "BETA"
- `organization.edit.landing.enabledLabel` - "Landing Page Enabled"
- `organization.edit.landing.sections` - "Sections"
- `organization.edit.landing.addSection` - "Add Section"
- `organization.edit.landing.selectToEdit` - "Select a section to edit or add a new one"

### Section Types
- `organization.edit.landing.sectionTypes.hero.label` - "Hero"
- `organization.edit.landing.sectionTypes.hero.description`
- `organization.edit.landing.sectionTypes.textAndImage.label` - "Text & Image"
- `organization.edit.landing.sectionTypes.textAndImage.description`
- `organization.edit.landing.sectionTypes.logos.label` - "Logos"
- `organization.edit.landing.sectionTypes.logos.description`
- `organization.edit.landing.sectionTypes.people.label` - "People"
- `organization.edit.landing.sectionTypes.people.description`
- `organization.edit.landing.sectionTypes.featuredCourses.label` - "Courses"
- `organization.edit.landing.sectionTypes.featuredCourses.description`

### Editor Sections
#### Hero Section
- `organization.edit.landing.editor.hero.title` - "Hero Section"
- `organization.edit.landing.editor.hero.tabs.*` - Content, Background, Buttons, Illustration
- `organization.edit.landing.editor.hero.heading` - "Heading"
- `organization.edit.landing.editor.hero.headingColor` - "Heading Color"
- `organization.edit.landing.editor.hero.subheading` - "Subheading"
- `organization.edit.landing.editor.hero.subheadingColor` - "Subheading Color"
- Background types (solid, gradient, image)
- Gradient presets and directions
- Button management
- Illustration positioning

#### Text & Image Section
- `organization.edit.landing.editor.textAndImage.*`

#### Logos Section
- `organization.edit.landing.editor.logos.*`

#### People Section
- `organization.edit.landing.editor.people.*`

#### Featured Courses Section
- `organization.edit.landing.editor.courses.*`

### Placeholders
- All form field placeholders under `organization.edit.landing.placeholders.*`

### Toast Messages
- `organization.edit.landing.toast.saving` - "Saving..."
- `organization.edit.landing.toast.saved` - "Landing page saved successfully"
- `organization.edit.landing.toast.saveFailed` - "Error saving landing page"
- `organization.edit.landing.toast.orgIdNotFound` - "Organization ID not found"
- `organization.edit.landing.toast.uploadSuccess` - "Image uploaded successfully"
- `organization.edit.landing.toast.uploadFailed` - "Failed to upload image"

## Migration Steps Required

### 1. Add useTranslations Hook
```typescript
const t = useTranslations('organization.edit.landing')
```

### 2. Move Constants Inside Component
The `SECTION_TYPES` constant must be moved inside the component to access translations:
```typescript
export default function OrgEditLanding() {
  const t = useTranslations('organization.edit.landing')

  const SECTION_TYPES = {
    hero: {
      icon: LayoutTemplate,
      label: t('sectionTypes.hero.label'),
      description: t('sectionTypes.hero.description')
    },
    // ... rest of section types
  }

  // ... component logic
}
```

### 3. Migrate All String Literals

#### Main UI Strings
- Page title and subtitle
- "BETA" badge
- "Landing Page Enabled" switch label
- "Sections" heading
- "Add Section" button
- Section selection placeholder

#### Section Type Buttons
Replace hardcoded section type labels and descriptions with translation keys.

#### Hero Section Editor
- All tab labels (Content, Background, Buttons, Illustration)
- Form labels (Heading, Subheading, colors, etc.)
- Background type options (Solid, Gradient, Image)
- Gradient direction labels with emojis
- Button text and placeholders
- Upload button labels

#### Text & Image Section Editor
- Content editor labels
- Image position options (Left, Right)
- Upload button text

#### Logos Section Editor
- "Logos" heading
- "Upload Logo" button
- "Add Logo" button

#### People Section Editor
- "People" heading
- Person form fields (Name, Username, Image, Description)
- "Upload Avatar" button
- "Add Person" button

#### Courses Section Editor
- "Select Courses" heading
- "Loading courses..." message
- Course selection buttons (Selected/Select)

### 4. Migrate Toast Messages
Replace all `toast.loading()`, `toast.success()`, and `toast.error()` calls:
```typescript
// Before
toast.loading('Saving...')
toast.success('Landing page saved successfully')
toast.error('Error saving landing page')

// After
toast.loading(t('toast.saving'))
toast.success(t('toast.saved'))
toast.error(t('toast.saveFailed'))
```

### 5. Migrate Form Placeholders
Replace all placeholder strings in Input, Textarea components:
```typescript
// Before
placeholder="Enter heading text"

// After
placeholder={t('placeholders.headingText')}
```

### 6. Handle Complex Nested Structures

The component has several deeply nested structures that need attention:

#### Background Gradient Selector
- Gradient type labels (Linear, Radial)
- Direction picker with emoji labels
- Preset gradient names
- Custom gradient builder labels

#### Button Builder
- Button text input
- Button link input
- Button color pickers (text and background)
- Add/Remove button actions

#### People/Logo Lists
- Add item buttons
- Remove item buttons
- Drag handles
- Empty state messages

### 7. File Upload Handlers
Migrate upload-related strings in:
- `handleFileUpload` functions
- Image upload buttons
- File type descriptions

## Key Considerations

### Plural Forms
Some messages require plural forms (Portuguese requires different endings):
```typescript
t('toast.uploadingPreviews', { count: files.length, plural: files.length === 1 ? '' : 's' })
```

### Dynamic Content
Some labels include dynamic content that needs interpolation:
```typescript
t('editor.hero.buttonText', { index: index + 1 })
```

### Gradient Direction Labels
The gradient direction labels include emojis that should be preserved:
```typescript
t('editor.hero.directions.topRight') // "↗️ Top Right"
```

## Testing Checklist

After migration, test:
- [ ] All section types can be created
- [ ] Section editors display correct labels in both languages
- [ ] Toast messages appear in correct language
- [ ] Form validation messages are translated
- [ ] Placeholders are translated
- [ ] Button labels are translated
- [ ] Drag & drop still works
- [ ] Image uploads work with translated messages
- [ ] Language switching updates all UI elements
- [ ] Gradient presets display correctly
- [ ] People/Logo lists work with translations
- [ ] Course selection works with translations

## File Location
`apps/web/components/Dashboard/Pages/Org/OrgEditLanding/OrgEditLanding.tsx`

## Estimated Effort
- Time: 3-4 hours
- Complexity: High (due to deeply nested structures and dynamic forms)
- Risk: Medium (extensive refactoring required)

## Notes
- The component uses form builders with dynamic fields
- Multiple tab interfaces need translation
- Color pickers and gradient selectors have complex UI
- Drag & drop functionality must be preserved
- All validation logic must be maintained
