export type UserType = 'candidate' | 'employee';
import type { Education } from '../../services/education.service';
import type { WorkExperience } from '../../services/work-experience.service';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: UserType;
  created_at: string;
  updated_at: string;
  candidate?: Candidate;
  employee?: Employee;
}

export interface UserFile {
  id: string;
  file_name: string;
  file_path: string;
  mime_type: string;
  size: number;
  file_type: 'profile_picture' | 'cv';
  created_at: string;
}

export interface Candidate {
  id: string;
  user_id: string;
  headline: string | null;
  date_of_birth: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  github: string | null;
  linkedin: string | null;
  educations: Education[];
  work_experiences: WorkExperience[];
  files: UserFile[];
  profile_created_at: string;
  profile_updated_at: string;
}

export interface Employee {
  id: string;
  user_id: string;
  roles: string[];
  position: string;
  profile_created_at: string;
  profile_updated_at: string;
}
