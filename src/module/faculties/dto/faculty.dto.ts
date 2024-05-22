import { IsString } from 'class-validator';

export class FacultyDto {
  @IsString()
  code: string;

  @IsString()
  name: string;
}
