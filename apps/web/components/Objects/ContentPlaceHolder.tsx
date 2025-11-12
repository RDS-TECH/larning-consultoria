'use client';
import React from 'react'
import useAdminStatus from '../Hooks/useAdminStatus'
import { useTranslations } from 'next-intl'


// Terrible name and terible implementation, need to be refactored asap
function ContentPlaceHolderIfUserIsNotAdmin({ text }: { text: string }) {
    const t = useTranslations('placeholder')
    const isUserAdmin = useAdminStatus() as any
    return (
        <span>{isUserAdmin ? text : t('noContent')}</span>
    )
}

export default ContentPlaceHolderIfUserIsNotAdmin