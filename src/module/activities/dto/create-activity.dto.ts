import { IsOptional } from 'class-validator';

export class CreateActivityDto {
  name: string;

  score: number;

  description: string;

  @IsOptional()
  image: string;

  @IsOptional()
  maxParticipants: number;

  address: string;

  orangizer: string;

  startDate: Date;

  endDate: Date;

  startRegistration: Date;

  endRegistration: Date;

  subcategoryId: string;
}

export class CreateExternalActivityDto {
  name: string;

  score: number;

  address: string;

  subcategoryId: string;
}
