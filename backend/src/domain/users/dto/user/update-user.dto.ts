import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { AuthProvider } from '../../interfaces/user.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  google_id?: string;

  @IsOptional()
  @IsEnum(AuthProvider)
  auth_provider?: AuthProvider;
}
