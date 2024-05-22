import { IsNumber, IsString } from 'class-validator';

export class AcademicYearDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsNumber()
  startYear: number;
}
