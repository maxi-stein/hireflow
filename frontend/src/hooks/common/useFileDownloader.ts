import { useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { fileService } from '../../services/file.service';

export function useFileDownloader() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { t } = useTranslation('profile');

  const downloadFile = useCallback(
    async (fileId: string, fileName: string): Promise<void> => {
      let url: string | null = null;
      try {
        setIsDownloading(true);
        const blob = await fileService.downloadFile(fileId);
        url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
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
    [t]
  );

  return {
    downloadFile,
    isDownloading,
  };
}
