import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Faculty } from './faculty.entity';

@Entity()
export class Organizer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => Faculty, (faculty) => faculty.organizer)
  faculty: Faculty;
}
