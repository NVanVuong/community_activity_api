import { IsOptional } from 'class-validator';

export class CreateProofDto {
  name: string;
  description: string;

  @IsOptional()
  image: string;
  date: Date;

  // Case create proof for external activity
  @IsOptional()
  score: number;

  @IsOptional()
  subcategoryId: string;
}
