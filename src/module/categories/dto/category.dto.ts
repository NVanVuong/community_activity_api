export class ActivityCategoryDto {
  name: string;
  index: number;
}

export class ActivitySubcategoryDto {
  name: string;
  minScore: number;
  maxScore: number;
  categoryIndex: number;
}
