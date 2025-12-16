export type UserType = 'candidate' | 'employee';

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

export interface Candidate {
  id: string;
  user_id: string;
  age: number | null;
  phone: string | null;
  github: string | null;
  linkedin: string | null;
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
