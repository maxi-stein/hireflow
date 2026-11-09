import { useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import {
  useCreateJobOfferMutation,
  useUpdateJobOfferMutation,
  useJobOfferQuery,
  useSearchSkillsQuery,
} from '../api/useJobOffers';
import { WorkMode, JobOfferStatus } from '../../services/job-offer.service';
import { ROUTES } from '../../router/routes.config';
import { createJobOfferSchema } from '../../schemas/job-offer.schema';
import { validateWithJoi } from '../../utils/form-validation';
import { normalizeText } from '../../utils/string';

export function useJobOfferForm() {
  const { t } = useTranslation(['jobs', 'common']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);

  const createMutation = useCreateJobOfferMutation();
  const updateMutation = useUpdateJobOfferMutation();

  const { data: jobOffer, isLoading: isLoadingJobOffer } = useJobOfferQuery(id || '');
  const { data: skillSuggestions = [] } = useSearchSkillsQuery(debouncedSearch);

  const form = useForm({
    initialValues: {
      position: '',
      location: '',
      work_mode: WorkMode.HYBRID,
      description: '',
      salaryCurrency: 'ARS',
      salaryMin: '' as number | '',
      salaryMax: '' as number | '',
      benefits: '',
      deadline: null as Date | null,
      skills: [] as string[],
      status: JobOfferStatus.OPEN as JobOfferStatus,
    },
    validate: validateWithJoi(createJobOfferSchema),
  });

  useEffect(() => {
    if (isEditMode && jobOffer) {
      let parsedCurrency = 'ARS';
      let parsedMin: number | '' = '';
      let parsedMax: number | '' = '';

      if (jobOffer.salary) {
        if (jobOffer.salary.includes('USD')) {
          parsedCurrency = 'USD';
        }
        const numbers = jobOffer.salary.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          parsedMin = parseInt(numbers[0], 10);
          if (numbers.length > 1) {
            parsedMax = parseInt(numbers[1], 10);
          }
        }
      }

      form.setValues({
        position: jobOffer.position,
        location: jobOffer.location,
        work_mode: jobOffer.work_mode as any,
        description: jobOffer.description,
        salaryCurrency: parsedCurrency,
        salaryMin: parsedMin,
        salaryMax: parsedMax,
        benefits: jobOffer.benefits || '',
        deadline: jobOffer.deadline ? new Date(jobOffer.deadline) : null,
        skills: jobOffer.skills.map((s) => s.skill_name),
        status: jobOffer.status,
      });
    }
  }, [jobOffer, isEditMode]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const normalizedSkills = normalizeText(values.skills);

      let salaryString = '';
      if (values.salaryMin !== '') {
        salaryString = `${values.salaryCurrency} ${values.salaryMin}`;
        if (values.salaryMax !== '') {
          salaryString += ` - ${values.salaryMax}`;
        }
      }

      const payload = {
        ...values,
        salary: salaryString,
        deadline: values.deadline ? new Date(values.deadline).toISOString() : undefined,
        skills: normalizedSkills.map((skill) => ({ skill_name: skill })),
      };

      delete (payload as any).salaryCurrency;
      delete (payload as any).salaryMin;
      delete (payload as any).salaryMax;

      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data: payload });
        notifications.show({
          title: t('create.notifications.successUpdateTitle'),
          message: t('create.notifications.successUpdateMessage'),
          color: 'green',
        });
      } else {
        const { status, ...createPayload } = payload;
        await createMutation.mutateAsync(createPayload as any);
        notifications.show({
          title: t('create.notifications.successCreateTitle'),
          message: t('create.notifications.successCreateMessage'),
          color: 'green',
        });
      }

      navigate(ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children[0].path);
    } catch (error) {
      notifications.show({
        title: t('create.notifications.errorTitle'),
        message: isEditMode
          ? t('create.notifications.errorMessageUpdate')
          : t('create.notifications.errorMessageCreate'),
        color: 'red',
        autoClose: 5000,
      });
      console.error(error);
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || (isEditMode && isLoadingJobOffer);

  return {
    form,
    isEditMode,
    isLoading,
    skillSuggestions,
    searchValue,
    setSearchValue,
    handleSubmit,
  };
}

