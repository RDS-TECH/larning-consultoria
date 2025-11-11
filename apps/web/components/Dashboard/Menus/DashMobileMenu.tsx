'use client'
import { useOrg } from '@components/Contexts/OrgContext'
import { Backpack, BadgeDollarSign, BookCopy, Home, School, Settings, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import AdminAuthorization from '@components/Security/AdminAuthorization'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import ToolTip from '@components/Objects/StyledElements/Tooltip/Tooltip'
import { useTranslations } from 'next-intl'
import { getUriWithOrg } from '@services/config/config'

function DashMobileMenu() {
  const t = useTranslations('dashboard.menu')
  const org = useOrg() as any
  const session = useLHSession() as any

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg text-white shadow-xl">
      <div className="flex justify-around items-center h-16 px-2">
        <AdminAuthorization authorizationMode="component">
          <ToolTip content={t('home')} slateBlack sideOffset={8} side="top">
            <Link href={`/`} className="flex flex-col items-center p-2" aria-label={t('goToDashboardHome')}>
              <Home size={20} />
              <span className="text-xs mt-1">{t('home')}</span>
            </Link>
          </ToolTip>
          <ToolTip content={t('courses')} slateBlack sideOffset={8} side="top">
            <Link href={getUriWithOrg(org?.slug, '/dash/courses')} className="flex flex-col items-center p-2" aria-label={t('manageCourses')}>
              <BookCopy size={20} />
              <span className="text-xs mt-1">{t('courses')}</span>
            </Link>
          </ToolTip>
          <ToolTip content={t('assignments')} slateBlack sideOffset={8} side="top">
            <Link href={getUriWithOrg(org?.slug, '/dash/assignments')} className="flex flex-col items-center p-2" aria-label={t('manageAssignments')}>
              <Backpack size={20} />
              <span className="text-xs mt-1">{t('assignments')}</span>
            </Link>
          </ToolTip>
          <ToolTip content={t('payments')} slateBlack sideOffset={8} side="top">
            <Link href={getUriWithOrg(org?.slug, '/dash/payments/customers')} className="flex flex-col items-center p-2" aria-label={t('managePayments')}>
              <BadgeDollarSign size={20} />
              <span className="text-xs mt-1">{t('payments')}</span>
            </Link>
          </ToolTip>
          <ToolTip content={t('users')} slateBlack sideOffset={8} side="top">
            <Link href={getUriWithOrg(org?.slug, '/dash/users/settings/users')} className="flex flex-col items-center p-2" aria-label={t('manageUsers')}>
              <Users size={20} />
              <span className="text-xs mt-1">{t('users')}</span>
            </Link>
          </ToolTip>
          <ToolTip content={t('organization')} slateBlack sideOffset={8} side="top">
            <Link href={getUriWithOrg(org?.slug, '/dash/org/settings/general')} className="flex flex-col items-center p-2" aria-label={t('organizationSettings')}>
              <School size={20} />
              <span className="text-xs mt-1">{t('organization')}</span>
            </Link>
          </ToolTip>
        </AdminAuthorization>
        <ToolTip content={t('settings')} slateBlack sideOffset={8} side="top">
          <Link href={getUriWithOrg(org?.slug, '/dash/user-account/settings/general')} className="flex flex-col items-center p-2" aria-label={t('userAccountSettings')}>
            <Settings size={20} />
            <span className="text-xs mt-1">{t('settings')}</span>
          </Link>
        </ToolTip>
      </div>
    </div>
  )
}

export default DashMobileMenu
