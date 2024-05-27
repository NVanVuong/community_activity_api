import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserActivity } from './user-activity.entity';

@Entity()
export class Proof {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  date: Date;

  @Column({ nullable: true })
  comment: string;

  @OneToOne(() => UserActivity, (userActivity) => userActivity.proof)
  @JoinColumn()
  userActivity: UserActivity;
}
