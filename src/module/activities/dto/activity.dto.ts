import { ActivityStatusEnum } from 'src/common/enum/status.enum';
import { Activity } from 'src/entity/activity.entity';
import { Subcategory } from 'src/entity/subcategory.entity';

export class ActivityDto extends Activity {
  name: string;
  score: number;
  description: string;
  image: string;
  maxParticipants: number;
  address: string;
  orangizer: string;
  startDate: Date;
  endDate: Date;
  startRegistration: Date;
  endRegistration: Date;
  subcategory: Subcategory;
  isExternal: boolean;
  status: ActivityStatusEnum;
}
