import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { User } from 'src/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessage } from 'src/decorator/respone-message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Activities retrieved successfully')
  getActivities(@CurrentUser() user: User, @Query('keyword') keyword: string) {
    return this.activitiesService.getActivities(user, keyword);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Activity retrieved successfully')
  getActivitysById(@Param('id') id: string) {
    return this.activitiesService.getActivity(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Activity created successfully')
  @UseInterceptors(FileInterceptor('image'))
  createActivity(
    @Body() createActivityDto: CreateActivityDto,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.activitiesService.createActivity(createActivityDto, user, file);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Activity updated successfully')
  @UseInterceptors(FileInterceptor('image'))
  updateActivity(
    @Param('id') id: string,
    @Body() createActivityDto: CreateActivityDto,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.activitiesService.updateActivity(
      id,
      createActivityDto,
      user,
      file,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Activity deleted successfully')
  deleteActivity(@Param('id') id: string) {
    return this.activitiesService.deleteActivity(id);
  }

  @Post(':id/register')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Activity registered successfully')
  registerActivity(@Param('id') id: string, @CurrentUser() user: User) {
    return this.activitiesService.registerActivity(id, user);
  }

  @Post(':id/cancel')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Activity canceled successfully')
  cancelActivity(@Param('id') id: string, @CurrentUser() user: User) {
    return this.activitiesService.cancelActivity(id, user);
  }
}
