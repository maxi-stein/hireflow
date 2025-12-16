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

export const userFileService = {
  getAllByCandidate: async (candidateId: string): Promise<UserFile[]> => {
    const response = await apiClient.get<UserFile[]>(`/files/user/${candidateId}`);
    return response.data;
  },

  downloadFile: async (fileId: string): Promise<Blob> => {
    const response = await apiClient.get(`/files/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
