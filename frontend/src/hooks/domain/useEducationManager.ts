import { useState } from 'react';
import { useForm, type UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import type { Education, DegreeType } from '../../services/education.service';
import { educationService } from '../../services/education.service';
import { validateWithJoi } from '../../utils/form-validation';
import { educationSchema } from '../../schemas/profile.schema';
import { parseLocalDate, formatLocalDate } from '../../utils/dateUtils';

export interface EducationFormValues {
  institution: string;
  degree_type: string;
  field_of_study: string;
  start_date: Date | null;
  end_date: Date | null;
  description: string;
}

export interface UseEducationManagerParams {
  candidateId: string;
  onUpdate: () => void;
}

export interface UseEducationManagerReturn {
  opened: boolean;
  editingId: string | null;
  loading: boolean;
  deleteModalOpen: boolean;
  form: UseFormReturnType<EducationFormValues>;
  handleOpen: (education?: Education) => void;
  handleClose: () => void;
  handleSubmit: (values: EducationFormValues) => Promise<void>;
  confirmDelete: (id: string) => void;
  handleDelete: () => Promise<void>;
  closeDeleteModal: () => void;
}

export function useEducationManager({
  candidateId,
  onUpdate,
}: UseEducationManagerParams): UseEducationManagerReturn {
  const { t } = useTranslation(['profile', 'common']);
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const form = useForm<EducationFormValues>({
    initialValues: {
      institution: '',
      degree_type: '',
      field_of_study: '',
      start_date: null,
      end_date: null,
      description: '',
    },
    validate: validateWithJoi(educationSchema),
  });

  const handleOpen = (education?: Education) => {
    if (education) {
      setEditingId(education.id);
      form.setValues({
        institution: education.institution,
        degree_type: education.degree_type,
        field_of_study: education.field_of_study,
        start_date: parseLocalDate(education.start_date),
        end_date: parseLocalDate(education.end_date),
        description: education.description || '',
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

  const handleSubmit = async (values: EducationFormValues) => {
    setLoading(true);
    try {
      if (!values.start_date) {
        throw new Error('Start date is required');
      }

      const payload = {
        institution: values.institution,
        degree_type: values.degree_type as DegreeType,
        field_of_study: values.field_of_study,
        start_date: formatLocalDate(values.start_date)!,
        end_date: formatLocalDate(values.end_date) || null,
        description: values.description,
      };

      if (editingId) {
        await educationService.update(editingId, payload);
        notifications.show({
          title: t('candidate.notifications.successTitle', 'Éxito'),
          message: t('education.notifications.updated', 'Educación actualizada'),
          color: 'green',
        });
      } else {
        await educationService.create(candidateId, payload);
        notifications.show({
          title: t('candidate.notifications.successTitle', 'Éxito'),
          message: t('education.notifications.added', 'Educación agregada'),
          color: 'green',
        });
      }
      onUpdate();
      setOpened(false);
    } catch (error) {
      console.error('Error saving education:', error);
      const errorMessage =
        error instanceof Error ? error.message : t('education.notifications.failedSave', 'Error al guardar');
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
      await educationService.delete(itemToDelete);
      notifications.show({
        title: t('candidate.notifications.successTitle', 'Éxito'),
        message: t('education.notifications.deleted', 'Educación eliminada'),
        color: 'green',
      });
      onUpdate();
      closeDeleteModal();
    } catch {
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Error'),
        message: t('education.notifications.failedDelete', 'Error al eliminar'),
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
