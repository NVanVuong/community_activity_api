import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from 'src/common/enum/role.enum';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  studentId: string;

  @IsString()
  @IsOptional()
  name: string;

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

  @IsOptional()
  username: string;
}
