import { apiClient } from './api';

export const DegreeType = {
  BACHELOR: 'Licenciatura',
  MASTER: 'Maestría',
  DOCTORATE: 'Doctorado',
  ASSOCIATE: 'Técnico Superior',
  DIPLOMA: 'Diploma',
  CERTIFICATION: 'Certificación',
  OTHER: 'Otro',
} as const;

export type DegreeType = (typeof DegreeType)[keyof typeof DegreeType];

export interface Education {
  id: string;
  institution: string;
  degree_type: DegreeType;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  description?: string;
}

export type CreateEducationDto = Omit<Education, 'id'>;
export type UpdateEducationDto = Partial<Omit<CreateEducationDto, 'candidate_id'>>;

export const educationService = {
  getAll: async (candidateId: string): Promise<Education[]> => {
    const { data } = await apiClient.get<Education[]>(`/candidates/${candidateId}/educations`); // Ensuring this exists or similar
    return data;
  },

  create: async (candidateId: string, education: CreateEducationDto): Promise<Education> => {
    const { data } = await apiClient.post<Education>(
      `/candidates/${candidateId}/educations`,
      education,
    );
    return data;
  },

  update: async (id: string, education: UpdateEducationDto): Promise<Education> => {
    const { data } = await apiClient.put<Education>(`/educations/${id}`, education);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/educations/${id}`);
  },
};
