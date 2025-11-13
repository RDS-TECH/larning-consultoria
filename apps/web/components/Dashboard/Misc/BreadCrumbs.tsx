'use client';
import { useOrg } from '@components/Contexts/OrgContext';
import { Backpack, Book, ChevronRight, CreditCard, School, User, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'
import { getUriWithOrg } from '@services/config/config'

type BreadCrumbsProps = {
  type: 'courses' | 'user' | 'users' | 'org' | 'orgusers' | 'assignments' | 'payments'
  last_breadcrumb?: string
}

function BreadCrumbs(props: BreadCrumbsProps) {
  const org = useOrg() as any
  const t = useTranslations('dashboard.misc.breadcrumbs')

  return (
    <div>
      <div className="h-7"></div>
      <div className="text-gray-400 tracking-tight font-medium text-sm flex space-x-1">
        <div className="flex items-center space-x-1">
          {props.type == 'courses' ? (
            <div className="flex space-x-2 items-center">
              {' '}
              <Book className="text-gray" size={14}></Book>
              <Link href={getUriWithOrg(org?.slug, '/dash/courses')}>{t('courses')}</Link>
            </div>
          ) : (
            ''
          )}
          {props.type == 'assignments' ? (
            <div className="flex space-x-2 items-center">
              {' '}
              <Backpack className="text-gray" size={14}></Backpack>
              <Link href={getUriWithOrg(org?.slug, '/dash/assignments')}>{t('assignments')}</Link>
            </div>
          ) : (
            ''
          )}
          {props.type == 'user' ? (
            <div className="flex space-x-2 items-center">
              {' '}
              <User className="text-gray" size={14}></User>
              <Link href={getUriWithOrg(org?.slug, '/dash/user-account/settings/general')}>
                {t('accountSettings')}
              </Link>
            </div>
          ) : (
            ''
          )}
          {props.type == 'orgusers' ? (
            <div className="flex space-x-2 items-center">
              {' '}
              <Users className="text-gray" size={14}></Users>
              <Link href={getUriWithOrg(org?.slug, '/dash/users/settings/users')}>{t('orgUsers')}</Link>
            </div>
          ) : (
            ''
          )}

          {props.type == 'org' ? (
            <div className="flex space-x-2 items-center">
              {' '}
              <School className="text-gray" size={14}></School>
              <Link href={getUriWithOrg(org?.slug, '/dash/org/settings/general')}>{t('orgSettings')}</Link>
            </div>
          ) : (
            ''
          )}
          {props.type == 'payments' ? (
            <div className="flex space-x-2 items-center">
              {' '}
              <CreditCard className="text-gray" size={14}></CreditCard>
              <Link href={getUriWithOrg(org?.slug, '/dash/payments')}>{t('payments')}</Link>
            </div>
          ) : (
            ''
          )}
          <div className="flex items-center space-x-1 first-letter:uppercase">
            {props.last_breadcrumb ? <ChevronRight size={17} /> : ''}
            <div className="first-letter:uppercase">
              {' '}
              {props.last_breadcrumb}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BreadCrumbs
