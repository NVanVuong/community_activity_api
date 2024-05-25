import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserActivitiesService } from './user-activities.service';
import { ResponseMessage } from 'src/decorator/respone-message.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('my-activities')
export class UserActivitiesController {
  constructor(private readonly userActivitiesService: UserActivitiesService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Activities retrieved successfully')
  getActivities(@Param('id') id: string) {
    return this.userActivitiesService.getUserActivities(id);
  }

  @Get(':activityId/participants')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Participants retrieved successfully')
  getParticipants(@Param('activityId') activityId: string) {
    return this.userActivitiesService.getParticipants(activityId);
  }
}
