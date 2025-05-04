import { EmployeeRole, UserType } from '../interfaces/user-interfaces';
import { Education } from './education.entity';

export class User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_type: UserType;
}

export class Employee extends User {
  role: EmployeeRole;
  position: string;
}

export class Candidate extends User {
  age: number;
  phone: string;
  resume_url: string;
  socials: string[];
  portfolio_url: string;
  github?: string;
  linkedin?: string;
  education: Education[];
  certifications: string[];
  portfolio: string[];
  references: string[];
  cover_letter: string;
  availability: string;
  location: string;
}
