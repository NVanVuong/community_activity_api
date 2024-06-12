import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserActivitiesService } from './user-activities.service';
import { ResponseMessage } from 'src/decorator/respone-message.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { User } from 'src/entity/user.entity';

@Controller('my-activities')
export class UserActivitiesController {
  constructor(private readonly userActivitiesService: UserActivitiesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Activities retrieved successfully')
  getActivities(@CurrentUser() user: User, @Query('keyword') keyword: string) {
    try {
      return this.userActivitiesService.getMyActivities(user.id, keyword);
    } catch (error) {
      return error;
    }
  }
}
