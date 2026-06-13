import { IsString, IsOptional, IsInt, Min, IsEnum, IsEmail } from 'class-validator';
import { Role } from '../auth/roles.decorator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  status?: string;
}
