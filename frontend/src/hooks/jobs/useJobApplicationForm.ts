import { useState, createElement } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { JobOffer } from '../../services/job-offer.service';
import { candidateApplicationService } from '../../services/candidate-application.service';

interface UseJobApplicationFormProps {
  jobOffer: JobOffer;
  candidateId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function useJobApplicationForm({
  jobOffer,
  candidateId,
  onSuccess,
  onClose,
}: UseJobApplicationFormProps) {
  const { t } = useTranslation(['applications']);
  const [submitting, setSubmitting] = useState(false);

  const initialValues: Record<string, number> = {};
  jobOffer.skills.forEach((skill) => {
    initialValues[skill.id] = 0;
  });

  const form = useForm({
    initialValues,
    validate: (values) => {
      const errors: Record<string, string> = {};
      jobOffer.skills.forEach((skill) => {
        if (
          values[skill.id] === undefined ||
          values[skill.id] === null ||
          values[skill.id] < 0
        ) {
          errors[skill.id] = t('applications:modal.validationError', 'Ingresá un valor válido (0 o más)');
        }
      });
      return errors;
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    try {
      const skillAnswers = Object.entries(values).map(([skillId, years]) => ({
        job_offer_skill_id: skillId,
        years_of_experience: Number(years) || 0,
      }));

      await candidateApplicationService.create({
        candidate_id: candidateId,
        job_offer_id: jobOffer.id,
        skill_answers: skillAnswers,
      });

      notifications.show({
        title: t('applications:modal.successTitle', '¡Postulación enviada con éxito!'),
        message: t(
          'applications:modal.successMessage',
          'Recibimos tus respuestas. Podrás seguir el avance desde tu panel de postulaciones.'
        ),
        color: 'green',
        icon: createElement(IconCheck, { size: 16 }),
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      notifications.show({
        title: t('applications:modal.errorTitle', 'Error al postular'),
        message:
          error.response?.data?.message ||
          t('applications:modal.errorMessage', 'Ocurrió un error al registrar la postulación'),
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    submitting,
    handleSubmit,
  };
}
