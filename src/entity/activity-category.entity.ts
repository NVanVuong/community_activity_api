import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ActivitySubcategory } from './activity-subcategory.entity';

@Entity()
export class ActivityCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'int' })
  index: number;

  @OneToMany(
    () => ActivitySubcategory,
    (activitySubcategory) => activitySubcategory.activityCategory,
    {
      eager: true,
    },
  )
  activitySubcategories: ActivitySubcategory[];
}
