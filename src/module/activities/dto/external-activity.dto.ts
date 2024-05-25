import { IsEmpty } from 'class-validator';

export class ExternalActivityDto {
  name: string;
  score: number;
  @IsEmpty()
  address: string;
  subcategoryId: string;
}
