import { useState, createElement } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { IconCheck } from '@tabler/icons-react';
import { fileService, FileType, type UserFile } from '../../services/file.service';
import { queryClient } from '../../services/queryClient';
import { FILES_QUERY_KEY, useCandidateFilesQuery } from '../api/useUserFiles';
import { FILE_CONSTANTS } from '../../constants/file.constants';
import type { Candidate } from '../../types/models/user.types';

export interface UseCandidateFilesManagerParams {
  candidate?: Candidate | null;
  onProfileUpdated?: () => void;
}

export interface UseCandidateFilesManagerReturn {
  cvFile: UserFile | undefined;
  photoFile: UserFile | undefined;
  uploadingPhoto: boolean;
  uploadingCV: boolean;
  handlePhotoUpload: (file: File | null) => Promise<void>;
  handleCVUpload: (file: File | null) => Promise<void>;
  handleViewCV: () => Promise<void>;
}

export function useCandidateFilesManager({
  candidate,
  onProfileUpdated,
}: UseCandidateFilesManagerParams): UseCandidateFilesManagerReturn {
  const { t } = useTranslation('profile');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);

  const { data: candidateFiles } = useCandidateFilesQuery(candidate?.id || '');

  const cvFile = candidateFiles?.find((f) => f.file_type === FileType.RESUME);
  const photoFile = candidateFiles?.find((f) => f.file_type === FileType.PROFILE_PICTURE);

  const handlePhotoUpload = async (file: File | null) => {
    if (!file) return;

    if (file.size > FILE_CONSTANTS.MAX_PHOTO_SIZE_BYTES) {
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Archivo muy grande'),
        message: t(
          'candidate.notifications.fileTooLarge',
          `La foto no debe superar los ${FILE_CONSTANTS.MAX_PHOTO_SIZE_MB}MB`,
        ),
        color: 'red',
      });
      return;
    }

    setUploadingPhoto(true);

    try {
      await fileService.uploadProfilePicture(file);
      queryClient.invalidateQueries({ queryKey: [...FILES_QUERY_KEY, 'candidate', candidate?.id] });
      notifications.show({
        title: t('candidate.notifications.successTitle', 'Éxito'),
        message: t('candidate.notifications.picitureUploaded', 'Foto de perfil actualizada'),
        color: 'green',
      });
      onProfileUpdated?.();
    } catch {
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Error'),
        message: t('candidate.notifications.uploadPhotoFailed', 'Error al subir la foto'),
        color: 'red',
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCVUpload = async (file: File | null) => {
    if (!file) return;

    setUploadingCV(true);
    try {
      await fileService.uploadCV(file);
      queryClient.invalidateQueries({ queryKey: [...FILES_QUERY_KEY, 'candidate', candidate?.id] });
      notifications.show({
        title: t('candidate.notifications.successTitle', 'Éxito'),
        message: t('candidate.notifications.cvUploaded', 'Currículum cargado correctamente'),
        color: 'green',
        icon: createElement(IconCheck, { size: 16 }),
      });
      onProfileUpdated?.();
    } catch {
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Error'),
        message: t('candidate.notifications.uploadCvFailed', 'Error al subir el CV'),
        color: 'red',
      });
    } finally {
      setUploadingCV(false);
    }
  };

  const handleViewCV = async () => {
    if (!cvFile) return;
    try {
      const blob = await fileService.downloadFile(cvFile.id);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch {
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Error'),
        message: t('candidate.notifications.openCvFailed', 'No se pudo abrir el CV'),
        color: 'red',
      });
    }
  };

  return {
    cvFile,
    photoFile,
    uploadingPhoto,
    uploadingCV,
    handlePhotoUpload,
    handleCVUpload,
    handleViewCV,
  };
}
