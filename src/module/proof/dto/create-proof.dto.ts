import { IsOptional } from 'class-validator';

export class CreateProofDto {
  name: string;
  description: string;

  @IsOptional()
  image: string;

  // Case create proof for external activity
  @IsOptional()
  startDate: Date;

  @IsOptional()
  endDate: Date;

  @IsOptional()
  address: string;

  @IsOptional()
  score: number;

  @IsOptional()
  subcategoryId: string;
}

export class ConfirmProofDto {
  comment?: string;
}
