import { IsEnum, IsString } from 'class-validator';

export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
  CLASS = 'class',
  FACULTY = 'faculty',
}

export class RoleDto {
  @IsEnum(RoleEnum)
  name: RoleEnum;

  @IsString()
  description: string;
}
