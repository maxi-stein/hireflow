import { apiClient } from './api';

export const fileService = {
  uploadCV: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    const { data } = await apiClient.post('/files/cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append('profile-picture', file);
    const { data } = await apiClient.post('/files/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  getFileUrl: (fileId: string) => {
    return `${apiClient.defaults.baseURL}/files/${fileId}`;
  },

  downloadFile: async (fileId: string) => {
    const { data } = await apiClient.get<Blob>(`/files/${fileId}`, {
      responseType: 'blob',
    });
    return data;
  },
};
