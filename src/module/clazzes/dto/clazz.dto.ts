import { IsString, IsUUID } from 'class-validator';

export class ClazzDto {
  @IsString()
  name: string;

  @IsUUID()
  facultyId: string;

  @IsUUID()
  academicYearId: string;
}
