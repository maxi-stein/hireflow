import { useState, createElement } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { IconCheck } from '@tabler/icons-react';
import { fileService } from '../../services/file.service';
import { userFileService, FileType, type UserFile as ServiceUserFile } from '../../services/user-file.service';
import { queryClient } from '../../services/queryClient';
import { FILES_QUERY_KEY, useCandidateFilesQuery } from '../api/useUserFiles';
import { useFileDownloader } from '../useFileDownloader';
import type { Candidate, UserFile as ModelUserFile } from '../../types/models/user.types';

export type CandidateFileItem = ServiceUserFile | ModelUserFile;

export interface UseCandidateFilesManagerParams {
  candidate?: Candidate | null;
  onProfileUpdated?: () => void;
}

export interface UseCandidateFilesManagerReturn {
  cvFile: CandidateFileItem | undefined;
  photoFile: CandidateFileItem | undefined;
  uploadingPhoto: boolean;
  uploadingCV: boolean;
  isDownloading: boolean;
  handlePhotoUpload: (file: File | null) => Promise<void>;
  handleCVUpload: (file: File | null) => Promise<void>;
  handleViewCV: () => Promise<void>;
  handleDownloadCV: () => Promise<void>;
}

export function useCandidateFilesManager({
  candidate,
  onProfileUpdated,
}: UseCandidateFilesManagerParams): UseCandidateFilesManagerReturn {
  const { t } = useTranslation('profile');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const { downloadFile, isDownloading } = useFileDownloader();

  const { data: candidateFiles } = useCandidateFilesQuery(candidate?.id || '');

  const cvFile: CandidateFileItem | undefined =
    candidateFiles?.find((f) => f.file_type === FileType.RESUME) ||
    candidate?.files?.find((f) => f.file_type === 'cv');

  const photoFile: CandidateFileItem | undefined =
    candidateFiles?.find((f) => f.file_type === FileType.PROFILE_PICTURE) ||
    candidate?.files?.find((f) => f.file_type === 'profile_picture');

  const handlePhotoUpload = async (file: File | null) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Archivo muy grande'),
        message: t('candidate.notifications.fileTooLarge', 'La foto no debe superar los 5MB'),
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
      const blob = await userFileService.downloadFile(cvFile.id);
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

  const handleDownloadCV = async () => {
    if (!cvFile) return;
    await downloadFile(cvFile.id, cvFile.file_name);
  };

  return {
    cvFile,
    photoFile,
    uploadingPhoto,
    uploadingCV,
    isDownloading,
    handlePhotoUpload,
    handleCVUpload,
    handleViewCV,
    handleDownloadCV,
  };
}
