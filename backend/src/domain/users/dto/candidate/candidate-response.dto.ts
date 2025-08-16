import { EducationResponseDto } from '../education/education-response.dto';

export class CandidateResponseDto {
  id: string;
  age: number;
  phone: string;
  resume_url: string;
  portfolio_url: string;
  github?: string | null;
  linkedin?: string | null;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
  };
  educations?: EducationResponseDto[];
  profile_created_at: Date;
  profile_updated_at: Date;
}
