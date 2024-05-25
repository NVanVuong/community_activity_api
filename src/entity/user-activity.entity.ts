import { UserActivityStatusEnum } from 'src/common/enum/status.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
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

  @Column({ default: false })
  isExternal: boolean;

  @ManyToOne(() => User, (user) => user.userActivities)
  user: User;

  @ManyToOne(() => Activity, (activity) => activity.userActivities, {
    nullable: true,
  })
  activity: Activity;

  @OneToOne(() => Proof, (proof) => proof.userActivity)
  proof: Proof;
}
