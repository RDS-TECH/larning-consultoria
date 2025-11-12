# Course Components i18n Translation Keys

This document lists all translation keys needed for the Course public-facing components migration to next-intl.

## Namespace: `public.course.actions`

### Buttons
- `buttons.startCourse` - "Start Course"
- `buttons.leaveCourse` - "Leave Course"
- `buttons.signIn` - "Sign In"
- `buttons.startCourseAriaLabel` - "Start this course"
- `buttons.leaveCourseAriaLabel` - "Leave this course"

### Progress
- `progress.readyToBegin` - "Ready to Begin?"
- `progress.startJourney` - "Start your learning journey with {count} exciting {activities}"
- `progress.activity` - "activity"
- `progress.activities` - "activities"
- `progress.courseProgress` - "Course Progress"
- `progress.completed` - "{completed} of {total} completed"
- `progress.viewProgressAriaLabel` - "View course progress: {completed} of {total} activities completed"

### Paid Course
- `paid.ownCourse` - "You Own This Course"
- `paid.ownCourseDescription` - "You have purchased this course and have full access to all content."
- `paid.paidCourse` - "Paid Course"
- `paid.paidCourseDescription` - "This course requires purchase to access its content."
- `paid.purchaseCourse` - "Purchase Course"
- `paid.purchaseDescription` - "Select a payment option to access this course"
- `paid.purchaseAriaLabel` - "Purchase this course to gain access"
- `paid.paidContent` - "Paid Content"
- `paid.paidContentDescription` - "This content requires a course purchase to access."

### Paid Options (sub-namespace: `public.course.actions.paid`)
- `benefits` - "Benefits"
- `showLess` - "Show less"
- `showMore` - "Show more"
- `minimumPrice` - "Minimum Price"
- `price` - "Price"
- `month` - "month"
- `choosePrice` - "Choose your price"
- `processing` - "Processing..."
- `subscribeNow` - "Subscribe Now"
- `purchaseNow` - "Purchase Now"
- `loading` - "Loading..."
- `productTypes.subscription` - "Subscription"
- `productTypes.oneTime` - "One-time payment"
- `productTypes.perMonth` - "per month"

### Paid Options Errors
- `errors.checkoutFailed` - "Failed to initiate checkout process"
- `errors.processingError` - "An error occurred while processing your request"
- `errors.loadFailed` - "Failed to load product options"

### Contributor
- `contributor.authenticate` - "Authenticate to contribute"
- `contributor.active` - "You are a contributor"
- `contributor.pending` - "Contributor application pending"
- `contributor.apply` - "Apply to contribute"
- `contributor.signUpAriaLabel` - "Sign up to apply as course contributor"
- `contributor.applyAriaLabel` - "Apply to become a course contributor"
- `contributor.applicationMessage` - "I would like to contribute to this course."

### Errors
- `errors.fetchProducts` - "Failed to fetch linked products"
- `errors.checkAccess` - "Failed to check course access. Please try again later."
- `errors.startCourse` - "Failed to start the course. Please try again later."
- `errors.leaveCourse` - "Failed to leave the course. Please try again later."
- `errors.submitApplication` - "Failed to submit your application. Please try again later."

### Toast Messages
- `toasts.startingCourse` - "Starting course..."
- `toasts.leavingCourse` - "Leaving course..."
- `toasts.courseStarted` - "Successfully started the course"
- `toasts.courseLeft` - "Successfully left the course"
- `toasts.submittingApplication` - "Submitting contributor application..."
- `toasts.applicationSubmitted` - "Your application to contribute has been submitted successfully"

## Namespace: `public.course.authors`

- `authorsAndUpdates` - "Authors & Updates"
- `author` - "Author"
- `authors` - "Authors"
- `andMore` - "& {count} more"

## Namespace: `public.course.progress`

- `title` - "Course Progress"
- `description` - "{completed} of {total} activities completed"

## Namespace: `public.course.updates`

### General
- `title` - "Course Updates"
- `count` - "{count} update" / "{count} updates" (with pluralization)
- `newUpdate` - "New Update"
- `cancel` - "Cancel"
- `createdAt` - "Created at {date}"

### Form
- `form.addUpdateTitle` - "Add new Course Update"
- `form.titleLabel` - "Update Title"
- `form.contentLabel` - "Update Content"
- `form.titlePlaceholder` - "What's new in this update?"
- `form.contentPlaceholder` - "Share the details of your update..."
- `form.publishUpdate` - "Publish Update"
- `form.addUpdate` - "Add Update"

### Validation
- `validation.titleRequired` - "Title is required"
- `validation.contentRequired` - "Content is required"

### Empty State
- `empty.noUpdates` - "No updates yet"
- `empty.description` - "Updates about this course will appear here"

### Delete
- `delete.button` - "Delete Update"
- `delete.buttonLabel` - "Delete"
- `delete.message` - "Are you sure you want to delete this update?"
- `delete.title` - "Delete Update?"

### Toast Messages
- `toasts.updateAdded` - "Update added successfully"
- `toasts.updateFailed` - "Failed to add update"
- `toasts.deleting` - "Deleting update..."
- `toasts.deleted` - "Update deleted successfully"
- `toasts.deleteFailed` - "Failed to delete update"

## Components Migrated (7 total)

1. **CoursesActions.tsx** - Main course action buttons and progress tracking
2. **CourseActionsMobile.tsx** - Mobile version of course actions with authors
3. **CoursePaidOptions.tsx** - Payment options for paid courses
4. **PaidCourseActivityDisclaimer.tsx** - Disclaimer for paid course content
5. **CourseAuthors.tsx** - Course authors display and updates section
6. **CourseProgress.tsx** - Course progress modal
7. **CourseUpdates.tsx** - Course updates dropdown widget

## String Count Summary

- **CoursesActions.tsx**: ~40 strings
- **CourseActionsMobile.tsx**: ~15 strings
- **CoursePaidOptions.tsx**: ~15 strings
- **PaidCourseActivityDisclaimer.tsx**: ~2 strings
- **CourseAuthors.tsx**: ~25 strings
- **CourseProgress.tsx**: ~3 strings
- **CourseUpdates.tsx**: ~20 strings

**Total: ~120 translation strings migrated**

## Notes

- All components have been marked with `'use client'` directive
- Import statement added: `import { useTranslations } from 'next-intl'`
- Translation hooks properly scoped to appropriate namespaces
- All hardcoded strings replaced with t() function calls
- Toast messages, form validations, and aria-labels all internationalized
- Empty states and error messages included
