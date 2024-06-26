import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Clazz } from './clazz.entity';
import { User } from './user.entity';

@Entity()
export class Faculty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Clazz, (clazz) => clazz.faculty)
  clazzes: Clazz[];

  @OneToMany(() => User, (user) => user.faculty)
  users: User[];
}
