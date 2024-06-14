import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserActivity } from './user-activity.entity';
import { Comment } from './comment.entity';

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

  @OneToMany(() => Comment, (comment) => comment.proof, {
    eager: true,
  })
  comments: Comment[];

  @ManyToOne(() => UserActivity, (userActivity) => userActivity.proofs, {
    eager: true,
  })
  userActivity: UserActivity;
}
