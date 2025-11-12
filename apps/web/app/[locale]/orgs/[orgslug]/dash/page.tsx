import Image from 'next/image'
import React from 'react'
import { BookCopy, School, Settings, University, Users } from 'lucide-react'
import Link from 'next/link'
import AdminAuthorization from '@components/Security/AdminAuthorization'
import { getTranslations } from 'next-intl/server'
import { getUriWithOrg } from '@services/config/config'

async function DashboardHome({ params }: { params: Promise<{ orgslug: string }> }) {
  const { orgslug } = await params;
  const t = await getTranslations('dashboard.home');
  return (
    <div className="flex items-center justify-center mx-auto min-h-screen flex-col p-4 sm:mb-0 mb-16">
      <div className="mx-auto pb-6 sm:pb-10">
        <Image
          alt="learnhouse logo"
          width={230}
          height={100}
          src="/learnhouse_logo.png"
          className="w-48 sm:w-auto"
        />
      </div>
      <AdminAuthorization authorizationMode="component">
        <div className="flex flex-col sm:flex-row gap-4 lg:gap-10">
          {/* Card components */}
          <DashboardCard
            href={getUriWithOrg(orgslug, '/dash/courses')}
            icon={<BookCopy className="mx-auto text-gray-500/100" size={50} />}
            title={t('courses.title')}
            description={t('courses.description')}
          />
          <DashboardCard
            href={getUriWithOrg(orgslug, '/dash/org/settings/general')}
            icon={<School className="mx-auto text-gray-500/100" size={50} />}
            title={t('organization.title')}
            description={t('organization.description')}
          />
          <DashboardCard
            href={getUriWithOrg(orgslug, '/dash/users/settings/users')}
            icon={<Users className="mx-auto text-gray-500/100" size={50} />}
            title={t('users.title')}
            description={t('users.description')}
          />
        </div>
      </AdminAuthorization>
      <div className="flex flex-col gap-6 sm:gap-10 mt-6 sm:mt-10">
        <AdminAuthorization authorizationMode="component">
          <div className="h-1 w-[100px] bg-neutral-200/100 rounded-full mx-auto"></div>
          <div className="flex justify-center items-center">
            <Link
              href={'https://university.learnhouse.io/'}
              target='_blank'
              className="flex mt-4 sm:mt-[40px] bg-black gap-2 items-center py-3 px-7 rounded-lg shadow-lg hover:scale-105 transition-all ease-linear cursor-pointer"
            >
              <University className="text-gray-100/100" size={20} />
              <div className="text-sm font-bold text-gray-100/100">
                {t('learnhouseUniversity')}
              </div>
            </Link>
          </div>
          <div className="mx-auto mt-4 sm:mt-[40px] w-28 h-1 bg-neutral-200/100 rounded-full"></div>
        </AdminAuthorization>

        <Link
          href={getUriWithOrg(orgslug, '/dash/user-account/settings/general')}
          className="flex bg-white shadow-lg p-4 items-center rounded-lg mx-auto hover:scale-105 transition-all ease-linear cursor-pointer max-w-md"
        >
          <div className="flex flex-col sm:flex-row mx-auto gap-2 sm:gap-3 items-center text-center sm:text-left">
            <Settings className="text-gray-500/100" size={20} />
            <div>
              <div className="font-bold text-gray-500/100">{t('accountSettings.title')}</div>
              <p className="text-sm text-gray-400/100">
                {t('accountSettings.description')}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

// New component for dashboard cards
function DashboardCard({ href, icon, title, description }: { href: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <Link
      href={href}
      className="flex bg-white shadow-lg p-6 w-full sm:w-[250px] rounded-lg items-center mx-auto hover:scale-105 transition-all ease-linear cursor-pointer"
    >
      <div className="flex flex-col mx-auto gap-2">
        {icon}
        <div className="text-center font-bold text-gray-500/100">{title}</div>
        <p className="text-center text-sm text-gray-400/100">{description}</p>
      </div>
    </Link>
  )
}

export default DashboardHome
