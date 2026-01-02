export interface JwtUser {
  id: string; // This is the entity_id (employee_id or candidate_id) from backend
  type: "employee" | "candidate";
  employee_roles?: string[];
  email: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access_token: string;
  user: JwtUser;
}
