import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Activity } from './activity.entity';
import { Category } from './category.entity';
import { Organization } from './organization.entity';
import { Role } from './role.entity';

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  minScore: number;

  @Column()
  maxScore: number;

  @ManyToOne(() => Category, (category) => category.subcategories)
  category: Category;

  @OneToMany(() => Activity, (activity) => activity.subcategory)
  activities: Activity[];

  @ManyToMany(() => Organization, (organization) => organization.subcategories)
  organizers: Organization[];

  @ManyToMany(() => Role, (role) => role.subcategories)
  roles: Role[];
}
