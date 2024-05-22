import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;
}
