'use client'
import FormLayout, {
  FormField,
  FormLabelAndMessage,
  Input,
  Textarea,
} from '@components/Objects/StyledElements/Form/Form';
import { useFormik } from 'formik';
import { AlertTriangle } from 'lucide-react';
import * as Form from '@radix-ui/react-form';
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import ThumbnailUpdate from './ThumbnailUpdate';
import { useCourse, useCourseDispatch } from '@components/Contexts/CourseContext';
import FormTagInput from '@components/Objects/StyledElements/Form/TagInput';
import LearningItemsList from './LearningItemsList';
import {
  CustomSelect,
  CustomSelectContent,
  CustomSelectItem,
  CustomSelectTrigger,
  CustomSelectValue,
} from "./CustomSelect";
import { useTranslations } from 'next-intl';

type EditCourseStructureProps = {
  orgslug: string
  course_uuid?: string
}

function EditCourseGeneral(props: EditCourseStructureProps) {
  const t = useTranslations('courses.edit.general');
  const tValidation = useTranslations('courses.edit.general.validation');

  const validate = (values: any) => {
    const errors = {} as any;

    if (!values.name) {
      errors.name = tValidation('required');
    } else if (values.name.length > 100) {
      errors.name = tValidation('nameTooLong');
    }

    if (!values.description) {
      errors.description = tValidation('required');
    } else if (values.description.length > 1000) {
      errors.description = tValidation('descriptionTooLong');
    }

    if (!values.learnings) {
      errors.learnings = tValidation('required');
    } else {
      try {
        const learningItems = JSON.parse(values.learnings);
        if (!Array.isArray(learningItems)) {
          errors.learnings = tValidation('invalidFormat');
        } else if (learningItems.length === 0) {
          errors.learnings = tValidation('atLeastOneLearningItem');
        } else {
          // Check if any item has empty text
          const hasEmptyText = learningItems.some(item => !item.text || item.text.trim() === '');
          if (hasEmptyText) {
            errors.learnings = tValidation('allLearningItemsMustHaveText');
          }
        }
      } catch (e) {
        errors.learnings = tValidation('invalidJSONFormat');
      }
    }

    return errors;
  };
  const [error, setError] = useState('');
  const course = useCourse();
  const dispatchCourse = useCourseDispatch() as any;
  const { isLoading, courseStructure } = course as any;

  // Initialize learnings as a JSON array if it's not already
  const initializeLearnings = useCallback((learnings: any) => {
    if (!learnings) {
      return JSON.stringify([{ id: Date.now().toString(), text: '', emoji: '📝' }]);
    }
    
    try {
      // Check if it's already a valid JSON array
      const parsed = JSON.parse(learnings);
      if (Array.isArray(parsed)) {
        return learnings;
      }
      
      // If it's a string but not a JSON array, convert it to a learning item
      if (typeof learnings === 'string') {
        return JSON.stringify([{ 
          id: Date.now().toString(), 
          text: learnings, 
          emoji: '📝' 
        }]);
      }
      
      // Default empty array
      return JSON.stringify([{ id: Date.now().toString(), text: '', emoji: '📝' }]);
    } catch (e) {
      // If it's not valid JSON, convert the string to a learning item
      if (typeof learnings === 'string') {
        return JSON.stringify([{ 
          id: Date.now().toString(), 
          text: learnings, 
          emoji: '📝' 
        }]);
      }
      
      // Default empty array
      return JSON.stringify([{ id: Date.now().toString(), text: '', emoji: '📝' }]);
    }
  }, []);

  // Create initial values object - memoize to avoid recreating on every render
  const getInitialValues = useCallback(() => {
    const thumbnailType = courseStructure?.thumbnail_type || 'image';
    return {
      name: courseStructure?.name || '',
      description: courseStructure?.description || '',
      about: courseStructure?.about || '',
      learnings: initializeLearnings(courseStructure?.learnings || ''),
      tags: courseStructure?.tags || '',
      public: courseStructure?.public || false,
      thumbnail_type: thumbnailType,
    };
  }, [courseStructure, initializeLearnings]);

  const formik = useFormik({
    initialValues: getInitialValues(),
    validate,
    onSubmit: async values => {
      try {
        // Update courseStructure with the form values on save
        const updatedCourse = {
          ...courseStructure,
          ...values,
        };
        dispatchCourse({ type: 'setCourseStructure', payload: updatedCourse });
        dispatchCourse({ type: 'setIsSaved' });
      } catch (e) {
        setError('Failed to save course structure.');
      }
    },
    enableReinitialize: false, // Disable auto-reinitialization to prevent loops
  }) as any;

  // Reset form when course UUID changes (different course loaded)
  const courseUuidRef = useRef(courseStructure?.course_uuid);
  const initialValuesRef = useRef(JSON.stringify(formik.initialValues));

  useEffect(() => {
    const currentUuid = courseStructure?.course_uuid;
    if (currentUuid && currentUuid !== courseUuidRef.current) {
      courseUuidRef.current = currentUuid;
      // Reset form with new course data
      const newInitialValues = getInitialValues();
      formik.resetForm({ values: newInitialValues });
      initialValuesRef.current = JSON.stringify(newInitialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseStructure?.course_uuid]);

  // Mark as not saved when form values change
  useEffect(() => {
    if (!isLoading && courseStructure) {
      const currentValues = JSON.stringify(formik.values);

      // Only mark as not saved if values actually changed from initial
      if (currentValues !== initialValuesRef.current) {
        dispatchCourse({ type: 'setIsNotSaved' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values, isLoading]);

  if (isLoading || !courseStructure) {
    return <div>{t('loading')}</div>;
  }

  const getThumbnailTypeLabel = (type: string) => {
    return t(`thumbnailTypes.${type}`);
  };

  return (
    <div className="h-full">
      <div className="h-6" />
      <div className="px-10 pb-10">
        <div className="bg-white rounded-xl shadow-xs">
          <FormLayout onSubmit={formik.handleSubmit} className="p-6">
            {error && (
              <div className="flex justify-center bg-red-200 rounded-md text-red-950 space-x-2 items-center p-4 mb-6 transition-all shadow-xs">
                <AlertTriangle size={18} />
                <div className="font-bold text-sm">{error}</div>
              </div>
            )}

            <div className="space-y-6">
              <FormField name="name">
                <FormLabelAndMessage label={t('name')} message={formik.errors.name} />
                <Form.Control asChild>
                  <Input
                    style={{ backgroundColor: 'white' }}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    type="text"
                    required
                  />
                </Form.Control>
              </FormField>

              <FormField name="description">
                <FormLabelAndMessage label={t('description')} message={formik.errors.description} />
                <Form.Control asChild>
                  <Input
                    style={{ backgroundColor: 'white' }}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    type="text"
                    required
                  />
                </Form.Control>
              </FormField>

              <FormField name="about">
                <FormLabelAndMessage label={t('about')} message={formik.errors.about} />
                <Form.Control asChild>
                  <Textarea
                    style={{ backgroundColor: 'white', height: '200px', minHeight: '200px' }}
                    onChange={formik.handleChange}
                    value={formik.values.about}
                    required
                  />
                </Form.Control>
              </FormField>

              <FormField name="learnings">
                <FormLabelAndMessage label={t('learnings')} message={formik.errors.learnings} />
                <Form.Control asChild>
                  <LearningItemsList
                    initialValue={formik.values.learnings}
                    onChange={(value) => formik.setFieldValue('learnings', value)}
                    error={formik.errors.learnings}
                    resetKey={courseStructure?.course_uuid}
                  />
                </Form.Control>
              </FormField>

              <FormField name="tags">
                <FormLabelAndMessage label={t('tags')} message={formik.errors.tags} />
                <Form.Control asChild>
                  <FormTagInput
                    placeholder={t('tagsPlaceholder')}
                    onChange={(value) => formik.setFieldValue('tags', value)}
                    value={formik.values.tags}
                  />
                </Form.Control>
              </FormField>

              <FormField name="thumbnail_type">
                <FormLabelAndMessage label={t('thumbnailType')} />
                <Form.Control asChild>
                  <CustomSelect
                    value={formik.values.thumbnail_type}
                    onValueChange={(value) => {
                      if (!value) return;
                      formik.setFieldValue('thumbnail_type', value);
                    }}
                  >
                    <CustomSelectTrigger className="w-full bg-white">
                      <CustomSelectValue>
                        {getThumbnailTypeLabel(formik.values.thumbnail_type || 'image')}
                      </CustomSelectValue>
                    </CustomSelectTrigger>
                    <CustomSelectContent>
                      <CustomSelectItem value="image">{t('thumbnailTypes.image')}</CustomSelectItem>
                      <CustomSelectItem value="video">{t('thumbnailTypes.video')}</CustomSelectItem>
                      <CustomSelectItem value="both">{t('thumbnailTypes.both')}</CustomSelectItem>
                    </CustomSelectContent>
                  </CustomSelect>
                </Form.Control>
              </FormField>

              <FormField name="thumbnail">
                <FormLabelAndMessage label={t('thumbnail')} />
                <Form.Control asChild>
                  <ThumbnailUpdate thumbnailType={formik.values.thumbnail_type} />
                </Form.Control>
              </FormField>
            </div>
          </FormLayout>
        </div>
      </div>
    </div>
  );
}

export default EditCourseGeneral;
