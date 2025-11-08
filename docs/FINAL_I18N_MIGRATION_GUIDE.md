# Final I18N Migration Guide - Completing 100% Coverage

## Overview

This document outlines the migration of the final 33 components to complete 100% i18n coverage across the entire LearnHouse application. All translation keys have been added to both `en.json` and `pt-BR.json` files.

## Translation Keys Structure

All keys have been organized hierarchically:

```
{
  "dashboard": {
    "misc": {...},
    "payments": {...},
    "userAccount": {...},
    "users": {...}
  },
  "public": {
    "landing": {...},
    "course": {...}
  },
  "activities": {...},
  "placeholder": {...}
}
```

## Migration Pattern

For each component:

1. Add `'use client'` directive if missing
2. Import: `import { useTranslations } from 'next-intl'`
3. Initialize: `const t = useTranslations('[namespace]')`
4. Replace ALL hardcoded strings with `t('key')`
5. Move any `validate()` functions inside component if needed
6. Handle toast messages, form labels, placeholders, buttons, etc.

---

## Module 1: Dashboard Misc (3 components)

### 1.1 BreadCrumbs.tsx
**Location**: `apps/web/components/Dashboard/Misc/BreadCrumbs.tsx`
**Namespace**: `dashboard.misc.breadcrumbs`

**Strings to migrate**:
- `courses` → `t('courses')`
- `assignments` → `t('assignments')`
- `accountSettings` → `t('accountSettings')`
- `orgUsers` → `t('orgUsers')`
- `orgSettings` → `t('orgSettings')`
- `payments` → `t('payments')`

### 1.2 CourseOverviewTop.tsx
**Location**: `apps/web/components/Dashboard/Misc/CourseOverviewTop.tsx`
**Namespace**: `dashboard.misc.courseOverview`

**Strings to migrate**:
- `Course` → `t('course')`
- `Rights Guide` → `t('rightsGuide')`

### 1.3 SaveState.tsx
**Location**: `apps/web/components/Dashboard/Misc/SaveState.tsx`
**Namespace**: `dashboard.misc.saveState`

**Strings to migrate**:
- `Unsaved changes` → `t('unsavedChanges')`
- `Saving...` → `t('saving')`
- `Saved` → `t('saved')`
- `Save` → `t('save')`

---

## Module 2: Payments (6 components)

### 2.1 PaymentsConfigurationPage.tsx
**Location**: `apps/web/components/Dashboard/Pages/Payments/PaymentsConfigurationPage.tsx`
**Namespace**: `dashboard.payments.configuration`

**Key strings**:
- Page title/description
- Stripe integration features
- Connection status
- Toast messages
- All button labels

**Pattern**:
```tsx
'use client'
import { useTranslations } from 'next-intl'

export default function PaymentsConfigurationPage() {
  const t = useTranslations('dashboard.payments.configuration')

  // Replace all hardcoded strings
  <h1>{t('title')}</h1>
  <p>{t('description')}</p>
  // etc...
}
```

### 2.2 PaymentsCustomersPage.tsx
**Location**: `apps/web/components/Dashboard/Pages/Payments/PaymentsCustomersPage.tsx`
**Namespace**: `dashboard.payments.customers`

**Key strings**:
- Table headers (user, product, type, amount, status, purchaseDate)
- Customer types (subscription, oneTime)
- Status messages
- Empty states

### 2.3 PaymentsProductPage.tsx
**Location**: `apps/web/components/Dashboard/Pages/Payments/PaymentsProductPage.tsx`
**Namespace**: `dashboard.payments.products`

**Key strings**:
- Product list
- Archive confirmation
- Product display
- Create button
- Empty state

### 2.4 CreateProductForm.tsx
**Location**: `apps/web/components/Dashboard/Pages/Payments/SubComponents/CreateProductForm.tsx`
**Namespace**: `dashboard.payments.products`

**Key strings**:
- Form labels (productName, description, productType, priceType, price, minimumAmount, currency, benefits)
- Placeholders
- Validation messages
- Submit button
- Toast messages

**Validation pattern**:
```tsx
const validate = (values: ProductFormValues) => {
  const errors: any = {}
  if (!values.name) errors.name = t('validation.nameRequired')
  if (!values.description) errors.description = t('validation.descriptionRequired')
  // etc...
  return errors
}
```

### 2.5 LinkCourseModal.tsx
**Location**: `apps/web/components/Dashboard/Pages/Payments/SubComponents/LinkCourseModal.tsx`
**Namespace**: `dashboard.payments.products.link`

**Key strings**:
- Modal title
- Link button
- Already linked status
- Empty states
- Toast messages

### 2.6 ProductLinkedCourses.tsx
**Location**: `apps/web/components/Dashboard/Pages/Payments/SubComponents/ProductLinkedCourses.tsx`
**Namespace**: `dashboard.payments.products.link`

**Key strings**:
- Section title
- Course list
- Unlink button
- Empty state
- Toast messages

---

## Module 3: User Account (4 components)

### 3.1 UserEditGeneral.tsx
**Location**: `apps/web/components/Dashboard/Pages/UserAccount/UserEditGeneral/UserEditGeneral.tsx`
**Namespace**: `dashboard.userAccount.general`

**Key strings**:
- Form fields: email, username, firstName, lastName, bio
- Field placeholders
- Additional details section
- Profile picture section
- Validation messages
- Toast messages
- Warning messages

**Pattern for character count**:
```tsx
<span>{t('bioCharactersLeft', { count: 400 - bio.length })}</span>
```

### 3.2 UserEditPassword.tsx
**Location**: `apps/web/components/Dashboard/Pages/UserAccount/UserEditPassword/UserEditPassword.tsx`
**Namespace**: `dashboard.userAccount.password`

**Key strings**:
- currentPassword, newPassword labels
- Change warning
- Update button
- Validation messages
- Toast messages

### 3.3 UserProfile.tsx
**Location**: `apps/web/components/Dashboard/Pages/UserAccount/UserProfile/UserProfile.tsx`

**No strings** - wrapper component only

### 3.4 UserProfileBuilder.tsx
**Location**: `apps/web/components/Dashboard/Pages/UserAccount/UserProfile/UserProfileBuilder.tsx`
**Namespace**: `dashboard.userAccount.profile.builder`

**LARGE COMPONENT** with many section types:

**Main UI**:
- title, beta, description
- sections, addSection
- selectSection message
- Save button and states

**Section Types** (use nested namespace `sectionTypes.[type]`):
- imageGallery: label, description, title, sectionTitle, images, imageUrl, caption, addImage
- text: label, description, title, sectionTitle, content
- links: label, description, title, sectionTitle, links, linkTitle, url, addLink
- skills: label, description, title, sectionTitle, skills, skillName, selectLevel, category, addSkill, levels
- experience: label, description, title, sectionTitle, experienceItems, fields, addExperience
- education: label, description, title, sectionTitle, educationItems, fields, addEducation
- affiliation: label, description, title, sectionTitle, affiliations, fields, addAffiliation
- courses: label, description, title, sectionTitle, autoDisplay

**Toast messages**: saving, saveSuccess, saveFailed, loadFailed

**Pattern**:
```tsx
const t = useTranslations('dashboard.userAccount.profile.builder')
const tSections = useTranslations('dashboard.userAccount.profile.builder.sectionTypes')

// Main UI
<h2>{t('title')}</h2>
<div>{t('beta')}</div>
<p>{t('description')}</p>

// Section types
{Object.entries(SECTION_TYPES).map(([type, config]) => (
  <div>
    <div>{tSections(`${type}.label`)}</div>
    <div>{tSections(`${type}.description`)}</div>
  </div>
))}
```

---

## Module 4: Users (2 components)

### 4.1 OrgAccess.tsx
**Location**: `apps/web/components/Dashboard/Pages/Users/OrgAccess/OrgAccess.tsx`
**Namespace**: `dashboard.users.access`

**Key sections**:

**Join Method** (`joinMethod` namespace):
- title, description
- open.title, open.description, open.confirmTitle, open.confirmMessage, open.confirmButton
- closed.title, closed.description, closed.confirmTitle, closed.confirmMessage, closed.confirmButton
- active status

**Invite Codes** (`inviteCodes` namespace):
- title, description
- table headers: code, signupLink, type, expirationDate, actions
- types: usergroup, normal
- deleteCode, deleteConfirmTitle, deleteConfirmMessage
- generateCode, generateTitle, generateDescription

**Toast** messages:
- deleting, deleteSuccess, deleteFailed
- changingMethod, changeSuccess (with {method} param), changeFailed

### 4.2 OrgUsersAdd.tsx
**Location**: `apps/web/components/Dashboard/Pages/Users/OrgUsersAdd/OrgUsersAdd.tsx`
**Namespace**: `dashboard.users.add`

**Key strings**:
- title, description
- placeholder (example emails)
- inviteCode, inviteCodeTooltip
- sendInvites button
- invitedUsers section: title, description, table headers, status values
- Toast messages: sending, sendSuccess, sendFailed

---

## Module 5: Public Pages (2 components)

### 5.1 Footer.tsx
**Location**: `apps/web/components/Footer/Footer.tsx`

**No strings** - wrapper for OrgScripts only

### 5.2 LandingClassic.tsx
**Location**: `apps/web/components/Landings/LandingClassic.tsx`
**Namespace**: `public.landing`

**Key strings**:
- collections, courses titles
- noCollections, noCourses
- createCollections, createCourses (placeholder text)

**Pattern**:
```tsx
'use client'
import { useTranslations } from 'next-intl'

export default function LandingClassic({ courses, collections, orgslug, org_id }) {
  const t = useTranslations('public.landing')

  return (
    <>
      <TypeOfContentTitle title={t('collections')} type="col" />
      // ...
      <h1>{t('noCollections')}</h1>
      <p>{t('createCollections')}</p>
    </>
  )
}
```

### 5.3 LandingCustom.tsx
**Location**: `apps/web/components/Landings/LandingCustom.tsx`

**Check if this file exists** - may not have user-facing strings

---

## Module 6: Course Public Pages (7 components)

### 6.1-6.3 CourseActions Components
**Namespace**: `public.course.actions`

**Files**:
- CourseActionsMobile.tsx
- CoursePaidOptions.tsx
- CoursesActions.tsx
- PaidCourseActivityDisclaimer.tsx

**Key strings**:
- startCourse, continueCourse
- enrollNow, learnMore
- freeCourse, paidCourse
- paidDisclaimer
- purchaseRequired
- selectPaymentMethod
- processing, purchaseSuccess, purchaseFailed

### 6.4 CourseAuthors.tsx
**Location**: `apps/web/components/Objects/Courses/CourseAuthors/CourseAuthors.tsx`
**Namespace**: `public.course.authors`

**Key strings**:
- courseAuthors
- author, contributor (role labels)

### 6.5 CourseProgress.tsx
**Location**: `apps/web/components/Objects/Courses/CourseProgress/CourseProgress.tsx`
**Namespace**: `public.course.progress`

**Key strings**:
- yourProgress
- completed, inProgress, notStarted

### 6.6 CourseUpdates.tsx
**Location**: `apps/web/components/Objects/Courses/CourseUpdates/CourseUpdates.tsx`
**Namespace**: `public.course.updates`

**Key strings**:
- courseUpdates
- noUpdates
- lastUpdate

---

## Module 7: Activity Viewers (8 components)

### 7.1 AssignmentBoxUI.tsx
**Location**: `apps/web/components/Objects/Activities/Assignment/AssignmentBoxUI.tsx`
**Namespace**: `activities.assignment`

**Key strings**:
- title, description
- submit, submitted
- dueDate, overdue

### 7.2 DocumentPdf.tsx
**Location**: `apps/web/components/Objects/Activities/DocumentPdf/DocumentPdf.tsx`
**Namespace**: `activities.document`

**Key strings**:
- loadingDocument
- downloadDocument
- viewFullscreen

### 7.3-7.4 Video Components
**Files**:
- LearnHousePlayer.tsx
- Video.tsx

**Namespace**: `activities.video`

**Key strings**:
- loadingVideo
- playVideo, pauseVideo

### 7.5-7.8 DynamicCanva Components
**Files**:
- DynamicCanva.tsx
- TableOfContents.tsx
- AI/AICanvaToolkit.tsx

**Namespace**: `activities.canva`

**Key strings**:
- tableOfContents
- aiToolkit
- generating
- tryAgain

---

## Module 8: Misc

### 8.1 ContentPlaceHolder.tsx
**Location**: `apps/web/components/Objects/ContentPlaceHolder.tsx`
**Namespace**: `placeholder`

**Key strings**:
- adminOnly (message for admin-only content)
- createContent (message to create content)

**Pattern**:
```tsx
'use client'
import { useTranslations } from 'next-intl'

export default function ContentPlaceHolderIfUserIsNotAdmin({ text }: { text: string }) {
  const t = useTranslations('placeholder')

  return (
    <AuthenticatedClientElement {...}>
      {text || t('createContent')}
    </AuthenticatedClientElement>
  )
}
```

---

## Migration Checklist

For each component:

- [ ] Add `'use client'` directive
- [ ] Import `useTranslations`
- [ ] Initialize translation hook with correct namespace
- [ ] Replace ALL hardcoded strings
- [ ] Handle form validation messages
- [ ] Handle toast messages (loading, success, error)
- [ ] Handle placeholders
- [ ] Handle button labels
- [ ] Handle modal/dialog titles and messages
- [ ] Test component renders correctly
- [ ] Test all user interactions (forms, buttons, etc.)
- [ ] Verify Portuguese translations display correctly

---

## Common Patterns

### Form Validation
```tsx
const t = useTranslations('namespace')

const validate = (values: FormValues) => {
  const errors: any = {}
  if (!values.name) {
    errors.name = t('validation.nameRequired')
  }
  if (values.amount <= 0) {
    errors.amount = t('validation.amountPositive')
  }
  return errors
}
```

### Toast Messages
```tsx
const t = useTranslations('namespace')

// Loading
const toastId = toast.loading(t('toast.saving'))

// Success
toast.success(t('toast.saveSuccess'), { id: toastId })

// Error
toast.error(t('toast.saveFailed'), { id: toastId })
```

### Dynamic Values
```tsx
// With parameters
t('bioCharactersLeft', { count: remaining })
t('changeSuccess', { method: 'open' })
t('removeFailed', { username: user.name })
```

### Conditional Content
```tsx
{isActive ? t('status.active') : t('status.inactive')}
{type === 'subscription' ? t('types.subscription') : t('types.oneTime')}
```

---

## Testing Strategy

After migrating each component:

1. **Visual Test**: Check component renders correctly
2. **Interaction Test**: Test all buttons, forms, interactions
3. **Language Test**: Switch to Portuguese and verify translations
4. **Validation Test**: Trigger form validation errors
5. **Toast Test**: Trigger success and error toast messages
6. **Edge Cases**: Test empty states, long strings, special characters

---

## Priority Order

Migrate in this order to minimize user impact:

1. **High Priority** (User-facing public pages):
   - Public Landing pages
   - Course public pages
   - Activity viewers

2. **Medium Priority** (Dashboard user flows):
   - User Account pages
   - Payments pages (if Stripe is enabled)

3. **Low Priority** (Admin-only):
   - Users management
   - Dashboard misc components

---

## Completion Status

### Translation Keys
- [x] English (en.json) - All keys added
- [x] Portuguese (pt-BR.json) - All keys added

### Components to Migrate
- [ ] Dashboard Misc (3/3)
- [ ] Payments (0/6)
- [ ] User Account (0/4)
- [ ] Users (0/2)
- [ ] Public Landing (0/2)
- [ ] Course Pages (0/7)
- [ ] Activities (0/8)
- [ ] Misc (0/1)

**Total**: 0/33 components migrated

---

## Notes

- All translation keys are comprehensive and cover every user-facing string
- Portuguese translations are accurate and maintain professional tone
- Some components may have additional strings not listed - use the JSON files as source of truth
- Components with form validation need special attention to move validate() inside component
- Toast messages should use the `{ id: toastId }` pattern for proper updates

---

## Next Steps

1. Begin migration starting with high-priority components
2. Test each component thoroughly after migration
3. Create commits for each module after completion
4. Update this checklist as components are completed
5. Final comprehensive test of entire application
6. Merge to dev branch

---

**Document Created**: November 8, 2025
**Translation Keys Status**: ✅ Complete (en.json + pt-BR.json)
**Migration Status**: 📝 Ready to begin
**Target**: 100% i18n coverage across entire application
