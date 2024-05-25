import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { RoleEnum } from 'src/common/enum/role.enum';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  studentId: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsEmail({}, { message: 'Invalid email' })
  @IsOptional()
  @MinLength(6)
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  phoneNumber: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsNumber()
  @IsOptional()
  score: number;

  @IsString()
  @IsOptional()
  clazzId: string;

  @IsString()
  @IsOptional()
  facultyId: string;

  @IsEnum(RoleEnum)
  role: RoleEnum;
}
