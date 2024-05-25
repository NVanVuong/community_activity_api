import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Faculty } from './faculty.entity';
import { AcademicYear } from './academic-year.entity';
import { User } from './user.entity';

@Entity()
export class Clazz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Faculty, (faculty) => faculty.clazzes, { eager: true })
  faculty: Faculty;

  @ManyToOne(() => AcademicYear, (academicYear) => academicYear.clazzes)
  academicYear: AcademicYear;

  @OneToMany(() => User, (user) => user.clazz)
  users: User[];
}
