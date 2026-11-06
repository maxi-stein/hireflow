import { useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { userFileService } from '../services/user-file.service';

export interface UseFileDownloaderOptions {
  downloadFn?: (fileId: string) => Promise<Blob>;
  showSuccessNotification?: boolean;
  successMessage?: string;
}

export type DownloadFunction = (fileId: string) => Promise<Blob>;

export function useFileDownloader(
  optionsOrFn?: DownloadFunction | UseFileDownloaderOptions
) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { t } = useTranslation('profile');

  const downloadFn =
    typeof optionsOrFn === 'function'
      ? optionsOrFn
      : optionsOrFn?.downloadFn ?? ((fileId: string) => userFileService.downloadFile(fileId));

  const showSuccess =
    typeof optionsOrFn === 'object' && optionsOrFn?.showSuccessNotification === true;

  const successMessage =
    typeof optionsOrFn === 'object' ? optionsOrFn?.successMessage : undefined;

  const downloadFile = useCallback(
    async (fileId: string, fileName: string): Promise<void> => {
      let url: string | null = null;
      try {
        setIsDownloading(true);
        const blob = await downloadFn(fileId);
        url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);

        if (showSuccess) {
          notifications.show({
            title: t('candidate.notifications.successTitle', { defaultValue: 'Éxito' }),
            message:
              successMessage ||
              t('candidate.notifications.downloadSuccess', { defaultValue: 'Descarga completada' }),
            color: 'green',
          });
        }
      } catch {
        notifications.show({
          title: t('candidate.notifications.errorTitle', { defaultValue: 'Error' }),
          message: t('candidate.actions.downloadError', { defaultValue: 'Error al descargar CV.' }),
          color: 'red',
        });
      } finally {
        if (url) {
          setTimeout(() => {
            window.URL.revokeObjectURL(url!);
          }, 100);
        }
        setIsDownloading(false);
      }
    },
    [downloadFn, showSuccess, successMessage, t]
  );

  return {
    downloadFile,
    isDownloading,
  };
}

