import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Clazz } from './clazz.entity';

@Entity()
export class AcademicYear {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  startYear: number;

  @OneToMany(() => Clazz, (clazz) => clazz.academicYear)
  clazzes: Clazz[];
}
