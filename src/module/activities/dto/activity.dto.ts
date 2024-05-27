import { Activity } from 'src/entity/activity.entity';

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
  subcategoryId: string;
  isExternal: boolean;
  isRegistrationExpired: boolean;
  isExpired: boolean;
  isRegistered: boolean;
}
