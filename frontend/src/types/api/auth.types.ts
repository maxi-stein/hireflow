export interface JwtUser {
  id: string;
  entity_id?: string;
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
