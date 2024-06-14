import { UserActivityStatusEnum } from 'src/common/enum/status.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Activity } from './activity.entity';
import { User } from './user.entity';
import { Proof } from './proof.entity';

@Entity()
export class UserActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: UserActivityStatusEnum.Registered })
  status: UserActivityStatusEnum;

  @ManyToOne(() => User, (user) => user.userActivities)
  user: User;

  @ManyToOne(() => Activity, (activity) => activity.userActivities, {
    eager: true,
  })
  activity: Activity;

  @OneToMany(() => Proof, (proof) => proof.userActivity)
  proofs: Proof;
}
