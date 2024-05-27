import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Subcategory } from './subcategory.entity';
import { UserActivity } from './user-activity.entity';

@Entity()
export class Activity extends Base {
  @Column()
  name: string;

  @Column()
  score: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: -1 })
  maxParticipants: number;

  @Column({ default: 0 })
  participants: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  orangizer: string;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  startRegistration: Date;

  @Column({ nullable: true })
  endRegistration: Date;

  @Column({ default: false })
  isExternal: boolean;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.activities)
  subcategory: Subcategory;

  @OneToMany(() => UserActivity, (userActivity) => userActivity.activity)
  userActivities: UserActivity[];
}
