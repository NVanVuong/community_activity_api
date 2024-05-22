import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Clazz } from './clazz.entity';
import { Exclude } from 'class-transformer';
import { Faculty } from './faculty.entity';
import { RoleEnum } from 'src/module/roles/dto/roles.dto';
import { UUID } from 'crypto';

@Entity()
export class User {
  @PrimaryColumn()
  id: string | UUID;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ unique: true, nullable: true })
  studentId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({ default: 0, nullable: true, type: 'int' })
  score: number;

  @Column({ default: RoleEnum.USER })
  role: RoleEnum;

  @ManyToOne(() => Clazz, (clazz) => clazz.users, { eager: true })
  clazz: Clazz;

  @ManyToOne(() => Faculty, (faculty) => faculty.users, { eager: true })
  faculty: Faculty;
}
