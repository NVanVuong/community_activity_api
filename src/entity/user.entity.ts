import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Clazz } from './clazz.entity';
import { Exclude } from 'class-transformer';
import { Faculty } from './faculty.entity';
import { UUID } from 'crypto';
import { UserActivity } from './user-activity.entity';
import { Comment } from './comment.entity';
import { Role } from './role.entity';

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

  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
  })
  role: Role;

  @ManyToOne(() => Clazz, (clazz) => clazz.users, { eager: true })
  clazz: Clazz;

  @ManyToOne(() => Faculty, (faculty) => faculty.users, { eager: true })
  faculty: Faculty;

  @OneToMany(() => UserActivity, (userActivity) => userActivity.user)
  userActivities: UserActivity[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
