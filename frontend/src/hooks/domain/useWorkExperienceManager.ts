import { useState } from 'react';
import { useForm, type UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import type { WorkExperience } from '../../services/work-experience.service';
import { workExperienceService } from '../../services/work-experience.service';
import { validateWithJoi } from '../../utils/form-validation';
import { workExperienceSchema } from '../../schemas/profile.schema';
import { parseLocalDate, formatLocalDate } from '../../utils/dateUtils';

export interface WorkExperienceFormValues {
  company: string;
  position: string;
  description: string;
  start_date: Date | null;
  end_date: Date | null;
}

export interface UseWorkExperienceManagerParams {
  candidateId: string;
  onUpdate: () => void;
}

export interface UseWorkExperienceManagerReturn {
  opened: boolean;
  editingId: string | null;
  loading: boolean;
  deleteModalOpen: boolean;
  form: UseFormReturnType<WorkExperienceFormValues>;
  handleOpen: (experience?: WorkExperience) => void;
  handleClose: () => void;
  handleSubmit: (values: WorkExperienceFormValues) => Promise<void>;
  confirmDelete: (id: string) => void;
  handleDelete: () => Promise<void>;
  closeDeleteModal: () => void;
}

export function useWorkExperienceManager({
  candidateId,
  onUpdate,
}: UseWorkExperienceManagerParams): UseWorkExperienceManagerReturn {
  const { t } = useTranslation(['profile', 'common']);
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const form = useForm<WorkExperienceFormValues>({
    initialValues: {
      company: '',
      position: '',
      description: '',
      start_date: null,
      end_date: null,
    },
    validate: validateWithJoi(workExperienceSchema),
  });

  const handleOpen = (experience?: WorkExperience) => {
    if (experience) {
      setEditingId(experience.id);
      form.setValues({
        company: experience.company_name,
        position: experience.position,
        description: experience.description,
        start_date: parseLocalDate(experience.start_date),
        end_date: parseLocalDate(experience.end_date),
      });
    } else {
      setEditingId(null);
      form.reset();
    }
    setOpened(true);
  };

  const handleClose = () => {
    setOpened(false);
  };

  const handleSubmit = async (values: WorkExperienceFormValues) => {
    setLoading(true);
    try {
      if (!values.start_date) {
        throw new Error('Start date is required');
      }

      const payload = {
        company_name: values.company,
        position: values.position,
        description: values.description,
        start_date: formatLocalDate(values.start_date)!,
        end_date: formatLocalDate(values.end_date) || null,
      };

      if (editingId) {
        await workExperienceService.update(editingId, payload);
        notifications.show({
          title: t('candidate.notifications.successTitle', 'Éxito'),
          message: t('experience.notifications.updated', 'Experiencia actualizada'),
          color: 'green',
        });
      } else {
        await workExperienceService.create(candidateId, payload);
        notifications.show({
          title: t('candidate.notifications.successTitle', 'Éxito'),
          message: t('experience.notifications.added', 'Experiencia agregada'),
          color: 'green',
        });
      }
      onUpdate();
      setOpened(false);
    } catch (error) {
      console.error('Error saving work experience:', error);
      const errorMessage =
        error instanceof Error ? error.message : t('experience.notifications.failedSave', 'Error al guardar');
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Error'),
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await workExperienceService.delete(itemToDelete);
      notifications.show({
        title: t('candidate.notifications.successTitle', 'Éxito'),
        message: t('experience.notifications.deleted', 'Experiencia eliminada'),
        color: 'green',
      });
      onUpdate();
      closeDeleteModal();
    } catch {
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Error'),
        message: t('experience.notifications.failedDelete', 'Error al eliminar'),
        color: 'red',
      });
    }
  };

  return {
    opened,
    editingId,
    loading,
    deleteModalOpen,
    form,
    handleOpen,
    handleClose,
    handleSubmit,
    confirmDelete,
    handleDelete,
    closeDeleteModal,
  };
}
