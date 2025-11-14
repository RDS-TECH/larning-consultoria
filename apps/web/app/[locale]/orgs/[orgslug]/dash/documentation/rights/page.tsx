'use client'
import React from 'react'
import { getUriWithOrg } from '@services/config/config'
import { useOrg } from '@components/Contexts/OrgContext'
import {
  Shield,
  Users,
  Crown,
  User,
  UserCog,
  GraduationCap,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface RightsDocumentationProps {
  params: Promise<{ orgslug: string }>
}

const RightsDocumentation = ({ params }: RightsDocumentationProps) => {
  const org = useOrg() as any
  const t = useTranslations('documentation.rights')
  const tRoles = useTranslations('documentation.rights.roleHierarchy')
  const tOwnership = useTranslations('documentation.rights.courseOwnership')

  const roleHierarchy = [
    {
      name: tRoles('admin.name'),
      icon: <Crown className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200',
      description: tRoles('admin.description'),
      permissions: [
        tRoles('admin.permissions.all'),
        tRoles('admin.permissions.manageOrg'),
        tRoles('admin.permissions.manageUsers'),
        tRoles('admin.permissions.manageCourses'),
        tRoles('admin.permissions.manageRoles')
      ],
      level: 4
    },
    {
      name: tRoles('maintainer.name'),
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      description: tRoles('maintainer.description'),
      permissions: [
        tRoles('maintainer.permissions.manageCourses'),
        tRoles('maintainer.permissions.manageUsers'),
        tRoles('maintainer.permissions.manageAssignments')
      ],
      level: 3
    },
    {
      name: tRoles('instructor.name'),
      icon: <GraduationCap className="w-6 h-6 text-green-600" />,
      color: 'bg-green-50 border-green-200',
      description: tRoles('instructor.description'),
      permissions: [
        tRoles('instructor.permissions.createCourses'),
        tRoles('instructor.permissions.manageOwnCourses'),
        tRoles('instructor.permissions.createAssignments'),
        tRoles('instructor.permissions.gradeAssignments')
      ],
      level: 2
    },
    {
      name: tRoles('user.name'),
      icon: <User className="w-6 h-6 text-gray-600" />,
      color: 'bg-gray-50 border-gray-200',
      description: tRoles('user.description'),
      permissions: [
        tRoles('user.permissions.viewCourses'),
        tRoles('user.permissions.submitAssignments'),
        tRoles('user.permissions.takeAssessments')
      ],
      level: 1
    }
  ]

  const courseOwnershipTypes = [
    {
      name: tOwnership('creator.name'),
      icon: <Crown className="w-5 h-5 text-yellow-600" />,
      color: 'bg-yellow-50 border-yellow-200',
      description: tOwnership('creator.description'),
      permissions: [
        tOwnership('creator.permissions.fullControl'),
        tOwnership('creator.permissions.manageContributors'),
        tOwnership('creator.permissions.changeAccess'),
        tOwnership('creator.permissions.deleteCourse')
      ]
    },
    {
      name: tOwnership('maintainer.name'),
      icon: <Shield className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      description: tOwnership('maintainer.description'),
      permissions: [
        tOwnership('maintainer.permissions.manageContent'),
        tOwnership('maintainer.permissions.manageContributors'),
        tOwnership('maintainer.permissions.changeAccess'),
        tOwnership('maintainer.permissions.cannotDelete')
      ]
    },
    {
      name: tOwnership('contributor.name'),
      icon: <UserCog className="w-5 h-5 text-green-600" />,
      color: 'bg-green-50 border-green-200',
      description: tOwnership('contributor.description'),
      permissions: [
        tOwnership('contributor.permissions.editContent'),
        tOwnership('contributor.permissions.createActivities'),
        tOwnership('contributor.permissions.cannotManageContributors'),
        tOwnership('contributor.permissions.cannotChangeAccess')
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-6 pt-16 w-full">
      <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm border border-gray-200 mb-6">
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <Link
            href={getUriWithOrg(org?.slug, '/dash')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">{t('backToDashboard')}</span>
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{t('title')}</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Role Hierarchy Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center space-x-2">
            <Crown className="w-6 h-6 text-purple-600" />
            <span>{tRoles('title')}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {roleHierarchy.map((role, index) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`bg-white rounded-xl border ${role.color} shadow-sm hover:shadow-lg transition-all duration-200 p-6 text-center`}
              >
                <div className="flex items-center justify-center space-x-3 mb-4">
                  {role.icon}
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{role.description}</p>
                <ul className="space-y-2 text-left">
                  {role.permissions.map((permission, permIndex) => (
                    <li key={permIndex} className="flex items-center space-x-2 text-sm text-gray-700">
                      <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Course Ownership Types */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center space-x-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>{tOwnership('title')}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {courseOwnershipTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`bg-white rounded-xl border ${type.color} shadow-sm hover:shadow-lg transition-all duration-200 p-6 text-center`}
              >
                <div className="flex items-center justify-center space-x-3 mb-4">
                  {type.icon}
                  <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                <ul className="space-y-2 text-left">
                  {type.permissions.map((permission, permIndex) => (
                    <li key={permIndex} className="flex items-center space-x-2 text-sm text-gray-700">
                      <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default RightsDocumentation
