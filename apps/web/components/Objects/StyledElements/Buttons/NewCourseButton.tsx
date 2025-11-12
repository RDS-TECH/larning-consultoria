'use client'
import { useTranslations } from 'next-intl'
import React from 'react'

const NewCourseButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => {
    const t = useTranslations('buttons')
    return (
      <button
        {...props}
        ref={ref}
        className="rounded-lg bg-black hover:scale-105 transition-all duration-100 ease-linear antialiased ring-offset-purple-800 p-2 px-5 my-auto font text-xs font-bold text-white drop-shadow-lg flex space-x-2 items-center"
      >
        <div>{t('newCourse')} </div>
        <div className="text-md bg-neutral-800 px-1 rounded-full">+</div>
      </button>
    )
  }
)

NewCourseButton.displayName = 'NewCourseButton'

export default NewCourseButton
