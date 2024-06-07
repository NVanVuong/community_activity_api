export class CategoryDto {
  name: string;
  index: number;
}

export class SubcategoryDto {
  name: string;
  minScore: number;
  maxScore: number;
  categoryIndex?: number;
}
