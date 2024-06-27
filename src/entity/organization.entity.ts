import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Subcategory } from './subcategory.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Subcategory, (subcategory) => subcategory.organizers)
  @JoinTable({
    name: 'Organization_hierarchy',
  })
  subcategories: Subcategory[];
}
