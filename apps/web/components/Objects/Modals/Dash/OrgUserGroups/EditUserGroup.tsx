'use client'
import FormLayout, {
    FormField,
    FormLabelAndMessage,
    Input,
} from '@components/Objects/StyledElements/Form/Form'
import * as Form from '@radix-ui/react-form'
import { useOrg } from '@components/Contexts/OrgContext'
import React from 'react'
import { updateUserGroup } from '@services/usergroups/usergroups'
import { mutate } from 'swr'
import { getAPIUrl } from '@services/config/config'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

type EditUserGroupProps = {
    usergroup: {
        id: number,
        name: string,
        description: string,
    }
}

function EditUserGroup(props: EditUserGroupProps) {
    const t = useTranslations('users.userGroups.editUserGroup')
    const tToast = useTranslations('users.userGroups.editUserGroup.toast')
    const tValidation = useTranslations('users.userGroups.editUserGroup.validation')
    const tFields = useTranslations('users.userGroups.editUserGroup.fields')
    const tButtons = useTranslations('users.userGroups.editUserGroup.buttons')

    const org = useOrg() as any;
    const session = useLHSession() as any
    const access_token = session?.data?.tokens?.access_token;
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const validate = (values: any) => {
        const errors: any = {}

        if (!values.name) {
            errors.name = tValidation('nameRequired')
        }

        return errors
    }

    const formik = useFormik({
        initialValues: {
            name: props.usergroup.name,
            description: props.usergroup.description,
        },
        validate,
        onSubmit: async (values) => {
            setIsSubmitting(true)
            const res = await updateUserGroup(props.usergroup.id, access_token, values)

            if (res.status == 200) {
                setIsSubmitting(false)
                toast.success(tToast('saved'))
                mutate(`${getAPIUrl()}usergroups/org/${org.id}`)
            } else {
                toast.error(tToast('saveError'))
                setIsSubmitting(false)
            }
        },
    })

    return (
        <FormLayout onSubmit={formik.handleSubmit}>
            <FormField name="name">
                <FormLabelAndMessage
                    label={tFields('name')}
                    message={formik.errors.name}
                />
                <Form.Control asChild>
                    <Input
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        type="name"
                        required
                    />
                </Form.Control>
            </FormField>
            <FormField name="description">
                <FormLabelAndMessage
                    label={tFields('description')}
                    message={formik.errors.description}
                />
                <Form.Control asChild>
                    <Input
                        onChange={formik.handleChange}
                        value={formik.values.description}
                        type="description"
                    />
                </Form.Control>
            </FormField>
            <div className="flex py-4">
                <Form.Submit asChild>
                    <button className="w-full bg-black text-white font-bold text-center p-2 rounded-md shadow-md hover:cursor-pointer">
                        {isSubmitting ? tButtons('loading') : tButtons('save')}
                    </button>
                </Form.Submit>
            </div>
        </FormLayout>
    )
}

export default EditUserGroup