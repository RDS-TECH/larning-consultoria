# Editor Module i18n Migration

## Overview
This document tracks the migration of all Editor module components to use next-intl for internationalization.

## Translation Structure Added

### English (en.json)
Added comprehensive `editor.*` namespace with the following sections:
- `editor.toolbar.*` - Toolbar button tooltips and labels
- `editor.placeholders.*` - Input placeholder text
- `editor.actions.*` - Action button labels
- `editor.alignment.*` - Alignment options
- `editor.size.*` - Size options
- `editor.blocks.*` - Block type labels
- `editor.upload.*` - Upload-related messages
- `editor.quiz.*` - Quiz component strings
- `editor.mathEquation.*` - Math equation editor strings
- `editor.webPreview.*` - Web preview card strings
- `editor.ai.*` - AI toolkit strings
- `editor.toast.*` - Toast notification messages

### Portuguese (pt-BR.json)
Complete Portuguese translations added matching the English structure.

## Components Migrated

### Completed
1. **EditorWrapper.tsx** - Toast notifications for save operations

### Pending Migration
The following components require migration (strings identified in each):

2. **Editor.tsx** - Main editor component
3. **ToolbarButtons.tsx** - All toolbar button tooltips
4. **LinkInputTooltip.tsx** - Link input placeholder
5. **AIEditorToolkit.tsx** - AI features interface:
   - "AI Editor", "PRE-ALPHA"
   - "Writer", "ContinueWriting", "MakeLonger", "Translate"
   - "Write about...", "Ask AI"
   - "Place your cursor at the end of a sentence to continue writing"
   - "Select text to make longer"
   - "Translate selected text to"
   - "Thinking...", "Something wrong happened"

6. **VideoBlockComponent.tsx** - Video upload and display:
   - "Video Block", "Drop your video here or click to browse"
   - "Supports MP4 and WebM formats"
   - "Uploading video...", "Failed to upload"
   - Size and alignment labels

7. **ImageBlockComponent.tsx** - Image upload and display:
   - "Image Block", "Drop your image here or click to browse"
   - "Supports JPG, PNG, WebP, GIF formats"
   - "Uploading image...", "Failed to upload"
   - Expand/download tooltips

8. **PDFBlockComponent.tsx** - PDF viewer:
   - "PDF Block", "Drop your PDF here or click to browse"
   - "Supports PDF format"
   - "Expand PDF", "Download PDF"
   - Upload messages

9. **QuizBlockComponent.tsx** - Interactive quiz:
   - "Quiz", "Your Question", "Answer"
   - "Add Question", "Add Answer", "Submit"
   - "Reset answers", "Delete answer", "Delete option"
   - "Add response option"
   - "All answers are correct!", "Some answers are incorrect!"
   - "Mark as correct", "Mark as incorrect"

10. **MathEquationBlockComponent.tsx** - LaTeX math editor:
    - "Math Equation"
    - "Templates", "Symbols", "Help"
    - "Select a template to insert"
    - "Click a symbol to insert"
    - "LaTeX Math Quick Reference"
    - "Fractions", "Exponents", "Subscripts", "Square root", "Summation", "Integral"
    - "View complete reference"
    - "Please refer to this", "guide", "for supported TeX functions"
    - Template names and descriptions (Fraction, Summation, etc.)

11. **WebPreviewComponent.tsx** - Web preview cards:
    - "Edit Web Preview Card"
    - "Update the website preview, button, and display options."
    - "Website URL", "Enter website URL..."
    - "Button Options", "Show button"
    - "Open in-app popup (might not work on all websites)"
    - "Button label", "Alignment"
    - "Visit Site", "Edit URL", "Delete Card"
    - "Unable to get metadata from this website..."

12. **InfoCalloutComponent.tsx** - Info callout blocks
13. **WarningCalloutComponent.tsx** - Warning callout blocks

## Migration Pattern

Each component should follow this pattern:

```typescript
'use client'
import { useTranslations } from 'next-intl'
// ... other imports

function Component() {
  const t = useTranslations('editor')  // or specific namespace

  // Replace hardcoded strings:
  // "Save" → t('save')
  // "Upload video..." → t('upload.uploadingVideo')
  // etc.
}
```

## Key Translation Keys by Component

### AIEditorToolkit
- `editor.ai.aiEditor`
- `editor.ai.preAlpha`
- `editor.ai.writer`
- `editor.ai.continueWriting`
- `editor.ai.makeLonger`
- `editor.ai.translate`
- `editor.ai.writeAbout`
- `editor.ai.askAI`
- `editor.ai.thinking`
- `editor.ai.somethingWrongHappened`
- `editor.ai.placeCursorToContinue`
- `editor.ai.selectTextToMakeLonger`
- `editor.ai.translateSelectedTextTo`

### Math Equation Editor
- `editor.blocks.mathEquation`
- `editor.mathEquation.templates`
- `editor.mathEquation.symbols`
- `editor.mathEquation.help`
- `editor.mathEquation.templates.*` (fraction, squareRoot, etc.)
- `editor.mathEquation.descriptions.*`

### Web Preview
- `editor.webPreview.*` (all keys in webPreview section)

### Upload Components (Video/Image/PDF)
- `editor.upload.dropOrClick`
- `editor.upload.dropImageOrClick`
- `editor.upload.dropPdfOrClick`
- `editor.upload.supportsMp4Webm`
- `editor.upload.supportsImageFormats`
- `editor.upload.supportsPdf`
- `editor.upload.uploadingVideo`
- `editor.upload.uploadingImage`
- `editor.upload.uploadingPdf`
- `editor.upload.failedToUpload`

### Quiz Component
- `editor.quiz.*` (all quiz-related keys)

## Testing Requirements

After migration, test:
1. Editor loads correctly in both English and Portuguese
2. All toolbar tooltips display translated text
3. AI toolkit shows correct translations
4. Block components (video, image, PDF, quiz, math) show translated labels
5. Error messages and toast notifications are translated
6. Placeholder text in inputs is translated

## Notes
- All translations have been added to both `en.json` and `pt-BR.json`
- The editor namespace is comprehensive and covers all identified strings
- Some components may have additional hardcoded strings that need identification
- Tiptap editor core features (bold, italic, etc.) should use toolbar translations

## Next Steps
1. Complete migration of remaining components (2-13 above)
2. Test all components in both languages
3. Add any missing translation keys discovered during testing
4. Update component tests to verify i18n integration
