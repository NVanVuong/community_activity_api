import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subcategory } from './subcategory.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'int' })
  index: number;

  @OneToMany(
    () => Subcategory,
    (activitySubcategory) => activitySubcategory.category,
    {
      eager: true,
    },
  )
  subcategories: Subcategory[];
}
