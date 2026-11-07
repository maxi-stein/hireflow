import { useState, createElement } from 'react';
import type { FormEvent } from 'react';
import { useForm, type UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { IconCheck } from '@tabler/icons-react';
import { candidateService } from '../../services/candidate.service';
import { parseLocalDate, formatLocalDate } from '../../utils/dateUtils';
import type { Candidate } from '../../types/models/user.types';

export interface CandidateProfileFormValues {
  headline: string;
  phone: string;
  city: string;
  country: string;
  github: string;
  linkedin: string;
  date_of_birth: Date | null;
}

export interface UseCandidateProfileFormParams {
  candidate?: Candidate | null;
  onProfileUpdated?: () => void;
}

export interface UseCandidateProfileFormReturn {
  form: UseFormReturnType<CandidateProfileFormValues>;
  loading: boolean;
  handleUpdateProfile: (values: CandidateProfileFormValues) => Promise<void>;
  handleSubmit: (e?: FormEvent<HTMLFormElement>) => void;
}

export function useCandidateProfileForm({
  candidate,
  onProfileUpdated,
}: UseCandidateProfileFormParams): UseCandidateProfileFormReturn {
  const { t } = useTranslation('profile');
  const [loading, setLoading] = useState(false);

  const form = useForm<CandidateProfileFormValues>({
    initialValues: {
      headline: candidate?.headline || '',
      phone: candidate?.phone || '',
      city: candidate?.city || '',
      country: candidate?.country || '',
      github: candidate?.github || '',
      linkedin: candidate?.linkedin || '',
      date_of_birth: parseLocalDate(candidate?.date_of_birth),
    },
  });

  const handleUpdateProfile = async (values: CandidateProfileFormValues) => {
    if (!candidate?.id) return;
    setLoading(true);
    try {
      await candidateService.update(candidate.id, {
        headline: values.headline?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        city: values.city?.trim() || undefined,
        country: values.country?.trim() || undefined,
        github: values.github?.trim() || undefined,
        linkedin: values.linkedin?.trim() || undefined,
        date_of_birth: formatLocalDate(values.date_of_birth),
      });
      notifications.show({
        title: t('candidate.notifications.successTitle', 'Éxito'),
        message: t('candidate.notifications.profileUpdated', 'Perfil actualizado correctamente'),
        color: 'green',
        icon: createElement(IconCheck, { size: 16 }),
      });
      onProfileUpdated?.();
    } catch {
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Error'),
        message: t('candidate.notifications.updateFailed', 'Error al actualizar el perfil'),
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = form.onSubmit(handleUpdateProfile);

  return {
    form,
    loading,
    handleUpdateProfile,
    handleSubmit,
  };
}
