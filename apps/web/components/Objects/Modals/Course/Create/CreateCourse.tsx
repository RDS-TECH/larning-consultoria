'use client'
import { Input } from "@components/ui/input"
import { Textarea } from "@components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"
import FormLayout, {
  FormField,
  FormLabelAndMessage,
} from '@components/Objects/StyledElements/Form/Form'
import * as Form from '@radix-ui/react-form'
import { createNewCourse } from '@services/courses/courses'
import { getOrganizationContextInfoWithoutCredentials } from '@services/organizations/orgs'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners'
import { revalidateTags } from '@services/utils/ts/requests'
import { useRouter } from 'next/navigation'
import { getUriWithOrg } from '@services/config/config'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {  UploadCloud, Image as ImageIcon } from 'lucide-react'
import UnsplashImagePicker from "@components/Dashboard/Pages/Course/EditCourseGeneral/UnsplashImagePicker"
import FormTagInput from "@components/Objects/StyledElements/Form/TagInput"
import { useTranslations } from 'next-intl'

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Course name is required')
    .max(100, 'Must be 100 characters or less'),
  description: Yup.string()
    .max(1000, 'Must be 1000 characters or less'),
  learnings: Yup.string(),
  tags: Yup.string(),
  visibility: Yup.boolean(),
  thumbnail: Yup.mixed().nullable()
})

function CreateCourseModal({ closeModal, orgslug }: any) {
  const t = useTranslations('courses.create')
  const router = useRouter()
  const session = useLHSession() as any
  const [orgId, setOrgId] = React.useState(null) as any
  const [showUnsplashPicker, setShowUnsplashPicker] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      learnings: '',
      visibility: true,
      tags: '',
      thumbnail: null
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const toast_loading = toast.loading(t('toast.creating'))

      try {
        const res = await createNewCourse(
          orgId,
          {
            name: values.name,
            description: values.description,
            learnings: values.learnings,
            tags: values.tags,
            visibility: values.visibility
          },
          values.thumbnail,
          session.data?.tokens?.access_token
        )


        if (res.success) {
          await revalidateTags(['courses'], orgslug)
          toast.dismiss(toast_loading)
          toast.success(t('toast.success'))

          if (res.data?.course_uuid) {

            // Remove "course_" prefix from UUID for URL
            const uuidWithoutPrefix = res.data.course_uuid.replace('course_', '')

            // Redirect to the course edit page using relative path
            const courseUrl = `/orgs/${orgslug}/dash/courses/course/${uuidWithoutPrefix}/general`

            await revalidateTags(['courses'], orgslug)
            closeModal()
            router.push(courseUrl)
          } else {
            console.error('No course_uuid in response:', res.data)
            toast.error('Curso criado, mas ocorreu um erro ao redirecionar')
          }
        } else {
          console.error('Course creation failed:', res)
          toast.error(res.data?.detail || t('toast.failed'))
        }
      } catch (error) {
        console.error('Error creating course:', error)
        toast.error(t('toast.failed'))
      } finally {
        toast.dismiss(toast_loading)
        setSubmitting(false)
      }
    }
  })

  const getOrgMetadata = async () => {
    const org = await getOrganizationContextInfoWithoutCredentials(orgslug, {
      revalidate: 360,
      tags: ['organizations'],
    })
    setOrgId(org.id)
  }

  useEffect(() => {
    if (orgslug) {
      getOrgMetadata()
    }
  }, [orgslug])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!validTypes.includes(file.type)) {
        toast.error(t('toast.invalidFileType'))
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('toast.fileTooLarge'))
        return
      }
      formik.setFieldValue('thumbnail', file)
      toast.success(t('toast.imageSelected'))
    }
  }

  const handleUnsplashSelect = async (imageUrl: string) => {
    setIsUploading(true)
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], 'unsplash_image.jpg', { type: 'image/jpeg' })
      formik.setFieldValue('thumbnail', file)
    } catch (error) {
      toast.error(t('toast.unsplashFailed'))
    }
    setIsUploading(false)
  }

  return (
    <FormLayout onSubmit={formik.handleSubmit} >
      <FormField name="name">
        <FormLabelAndMessage
          label={t('fields.name.label')}
          message={formik.errors.name}
        />
        <Form.Control asChild>
          <Input
            onChange={formik.handleChange}
            value={formik.values.name}
            type="text"
            required
          />
        </Form.Control>
      </FormField>

      <FormField name="description">
        <FormLabelAndMessage
          label={t('fields.description.label')}
          message={formik.errors.description}
        />
        <Form.Control asChild>
          <Textarea
            onChange={formik.handleChange}
            value={formik.values.description}

          />
        </Form.Control>
      </FormField>

      <FormField name="thumbnail">
        <FormLabelAndMessage
          label={t('fields.thumbnail.label')}
          message={formik.errors.thumbnail}
        />
        <div className="w-auto bg-gray-50 rounded-xl outline outline-1 outline-gray-200 h-[200px] shadow-sm">
          <div className="flex flex-col justify-center items-center h-full">
            <div className="flex flex-col justify-center items-center">
              {formik.values.thumbnail ? (
                <img
                  src={URL.createObjectURL(formik.values.thumbnail)}
                  className={`${isUploading ? 'animate-pulse' : ''} shadow-sm w-[200px] h-[100px] rounded-md`}
                />
              ) : (
                <img
                  src="/empty_thumbnail.png"
                  className="shadow-sm w-[200px] h-[100px] rounded-md bg-gray-200"
                />
              )}
              <div className="flex justify-center items-center space-x-2">
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                />
                <button
                  type="button"
                  className="font-bold antialiased items-center text-gray text-sm rounded-md px-4 mt-6 flex"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <UploadCloud size={16} className="mr-2" />
                  <span>{t('fields.thumbnail.uploadImage')}</span>
                </button>
                <button
                  type="button"
                  className="font-bold antialiased items-center text-gray text-sm rounded-md px-4 mt-6 flex"
                  onClick={() => setShowUnsplashPicker(true)}
                >
                  <ImageIcon size={16} className="mr-2" />
                  <span>{t('fields.thumbnail.chooseFromGallery')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </FormField>

			<FormField name="learnings">
				<FormLabelAndMessage
					label={t('fields.learnings.label')}
					message={formik.errors.learnings}
				/>
				<FormTagInput
					placeholder={t('fields.learnings.placeholder')}
					value={formik.values.learnings}
					onChange={(value) => formik.setFieldValue('learnings', value)}
					error={formik.errors.learnings}
				/>
			</FormField>

			<FormField name="tags">
				<FormLabelAndMessage
					label={t('fields.tags.label')}
					message={formik.errors.tags}
				/>
				<FormTagInput
					placeholder={t('fields.tags.placeholder')}
					value={formik.values.tags}
					onChange={(value) => formik.setFieldValue('tags', value)}
					error={formik.errors.tags}
				/>
			</FormField>

      <FormField name="visibility">
        <FormLabelAndMessage
          label={t('fields.visibility.label')}
          message={formik.errors.visibility}
        />
        <Select
          value={formik.values.visibility.toString()}
          onValueChange={(value) => formik.setFieldValue('visibility', value === 'true')}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('fields.visibility.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">{t('fields.visibility.public')}</SelectItem>
            <SelectItem value="false">{t('fields.visibility.private')}</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="px-4 py-2 bg-black text-white text-sm font-bold rounded-md"
        >
          {formik.isSubmitting ? (
            <BarLoader
              cssOverride={{ borderRadius: 60 }}
              width={60}
              color="#ffffff"
            />
          ) : (
            t('submit')
          )}
        </button>
      </div>

      {showUnsplashPicker && (
        <UnsplashImagePicker
          onSelect={handleUnsplashSelect}
          onClose={() => setShowUnsplashPicker(false)}
        />
      )}
    </FormLayout>
  )
}

export default CreateCourseModal
