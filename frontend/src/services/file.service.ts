import { apiClient } from './api';

export const FileType = {
  PROFILE_PICTURE: 'profile_picture',
  RESUME: 'cv',
} as const;

export type FileType = (typeof FileType)[keyof typeof FileType];

export interface UserFile {
  id: string;
  file_name: string;
  stored_name: string;
  file_path: string;
  mime_type: string;
  size: number;
  file_type: FileType;
  created_at: string;
  updated_at: string;
}

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

  getAllByCandidate: async (candidateId: string): Promise<UserFile[]> => {
    const response = await apiClient.get<UserFile[]>(`/files/user/${candidateId}`);
    return response.data;
  },

  // Get the binary file
  downloadFile: async (fileId: string): Promise<Blob> => {
    const { data } = await apiClient.get<Blob>(`/files/${fileId}`, {
      responseType: 'blob',
    });
    return data;
  },

  // Generate public endpoint url for the file (baseURL = api url)
  getFileUrl: (fileId: string) => {
    return `${apiClient.defaults.baseURL}/files/${fileId}`;
  },
};
