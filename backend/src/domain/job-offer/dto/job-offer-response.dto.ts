import { JobOfferSkillResponseDto } from '../../job-offer-skills/dto/job-offer-skill-response-dto';
import { JobOfferStatus } from '../interfaces';
import { WorkMode } from '../interfaces/work-mode.enum';

export class JobOfferResponseDto {
  id: string;
  position: string;
  location: string;
  work_mode: WorkMode;
  description: string;
  salary?: string;
  benefits?: string;
  status: JobOfferStatus;
  created_at: Date;
  updated_at: Date;
  skills: JobOfferSkillResponseDto[];
  deadline?: Date;
  applicants_count: number;
}
