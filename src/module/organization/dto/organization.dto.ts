import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class AddSubcategoriesDto {
  @IsArray()
  subcategoryIds: string[];
}
