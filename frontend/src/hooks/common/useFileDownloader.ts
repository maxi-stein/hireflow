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
        //Set spinner state
        setIsDownloading(true);

        // Get binary (in the browser's RAM memory)
        const blob = await fileService.downloadFile(fileId);

        // Generate download url (blob:http://localhost:5173/id)
        url = window.URL.createObjectURL(blob);

        // Create a <a> with href to the url
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);

        // Simulate a user click to trigger the download
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
          // Clear RAM memory from browser with 100ms delay
          setTimeout(() => {
            window.URL.revokeObjectURL(url!);
          }, 100);
        }
        setIsDownloading(false);
      }
    },
    [t],
  );

  return {
    downloadFile,
    isDownloading,
  };
}
