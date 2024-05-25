import { IsNotEmpty } from 'class-validator';
import { Activity } from 'src/entity/activity.entity';
import { User } from 'src/entity/user.entity';

export class UserActivityDto {
  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  activity: Activity;
}
