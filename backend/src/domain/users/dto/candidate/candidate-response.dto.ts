import { EducationResponseDto } from '../education/education-response.dto';
import { WorkExperienceResponseDto } from '../work-experience/work-experience-response.dto';

export class CandidateResponseDto {
  id: string;
  age: number;
  phone: string;
  github: string | null;
  linkedin: string | null;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
  };
  educations: EducationResponseDto[];
  work_experiences: WorkExperienceResponseDto[];
  profile_created_at: Date;
  profile_updated_at: Date;
}
