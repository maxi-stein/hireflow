import { apiClient } from './api';

export interface WorkExperience {
  id: string;
  company_name: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string | null;
}

export type CreateWorkExperienceDto = Omit<WorkExperience, 'id'> & {
  candidate_id: string;
};
export type UpdateWorkExperienceDto = Partial<Omit<CreateWorkExperienceDto, 'candidate_id'>>;

export const workExperienceService = {
  getAll: async (candidateId: string): Promise<WorkExperience[]> => {
    const { data } = await apiClient.get<WorkExperience[]>(
      `/work-experiences?candidate_id=${candidateId}`,
    );
    return data;
  },

  create: async (
    candidateId: string,
    workExperience: Omit<CreateWorkExperienceDto, 'candidate_id'>,
  ): Promise<WorkExperience> => {
    const { data } = await apiClient.post<WorkExperience>('/work-experiences', {
      ...workExperience,
      candidate_id: candidateId,
    });
    return data;
  },

  update: async (id: string, workExperience: UpdateWorkExperienceDto): Promise<WorkExperience> => {
    const { data } = await apiClient.patch<WorkExperience>(
      `/work-experiences/${id}`,
      workExperience,
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/work-experiences/${id}`);
  },
};
