import { DegreeType } from '../../interfaces';

export class EducationResponseDto {
  id: string;
  institution: string;
  degree_type: DegreeType;
  field_of_study: string;
  start_date: Date;
  end_date: Date | null;
  description?: string;
  candidate_id: string;
  created_at: Date;
  updated_at: Date;
}
