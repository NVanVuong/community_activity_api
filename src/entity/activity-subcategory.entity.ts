import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityCategory } from './activity-category.entity';

@Entity()
export class ActivitySubcategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  minScore: number;

  @Column()
  maxScore: number;

  @ManyToOne(
    () => ActivityCategory,
    (activityCategory) => activityCategory.activitySubcategories,
  )
  activityCategory: ActivityCategory;
}
