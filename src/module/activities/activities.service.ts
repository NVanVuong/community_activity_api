import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/entity/activity.entity';
import { Repository } from 'typeorm';
import { CreateActivityDto } from './dto/create-activity.dto';
import { CategoriesService } from '../categories/categories.service';
import { User } from 'src/entity/user.entity';
import { plainToInstance } from 'class-transformer';
import { ActivityDto } from './dto/activity.dto';
import { UserActivitiesService } from '../user-activities/user-activities.service';
import { ActivityActionEnum } from 'src/common/enum/action.enum';
import { UserActivityStatusEnum } from 'src/common/enum/status.enum';
import { RoleEnum } from 'src/common/enum/role.enum';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    private categoriesService: CategoriesService,
    private userActivitiesService: UserActivitiesService,
  ) {}

  async getActivities(user: User) {
    const activities = await this.activityRepository.find({
      where: { isExternal: false },
      relations: ['userActivities', 'userActivities.user'],
    });

    const currentDate = new Date();
    const activityDtos = activities.map((activity) => {
      const activityDto = plainToInstance(ActivityDto, activity);

      activityDto.isRegistrationExpired =
        currentDate > activity.endRegistration;
      activityDto.isExpired = currentDate > activity.endDate;
      if (user.role === RoleEnum.USER) {
        activityDto.isRegistered = activity.userActivities.some(
          (ua) =>
            ua.user.id === user.id &&
            ua.status !== UserActivityStatusEnum.Canceled,
        );
      }

      return activityDto;
    });

    return activityDtos;
  }

  async getActivity(id: string) {
    const activity = await this.activityRepository.findOne({
      where: { id },
    });

    if (!activity) {
      throw new BadRequestException('Activity not found');
    }

    const activityDto = plainToInstance(ActivityDto, activity);

    const date = new Date();
    activityDto.isRegistrationExpired = date > activityDto.endRegistration;

    activityDto.isExpired = date > activityDto.endDate;

    return activityDto;
  }

  async createActivity(createActivityDto: CreateActivityDto, user: User) {
    const { score, subcategoryId } = createActivityDto;

    const subcategory =
      await this.categoriesService.getSubcategory(subcategoryId);

    if (score < subcategory.minScore || score > subcategory.maxScore) {
      throw new BadRequestException(
        `Score must be between ${subcategory.minScore} and ${subcategory.maxScore} of the subcategory ${subcategory.name}`,
      );
    }

    const activity = this.activityRepository.create({
      ...createActivityDto,
      createdId: user.id,
    });

    activity.subcategory = subcategory;

    return this.activityRepository.save(activity);
  }

  async updateActivity(
    id: string,
    createActivityDto: CreateActivityDto,
    user: User,
  ) {
    const { score, subcategoryId } = createActivityDto;

    const activity = await this.getActivity(id);

    const subcategory =
      await this.categoriesService.getSubcategory(subcategoryId);

    if (score < subcategory.minScore || score > subcategory.maxScore) {
      throw new BadRequestException(
        `Score must be between ${subcategory.minScore} and ${subcategory.maxScore} of the subcategory ${subcategory.name}`,
      );
    }

    Object.assign(
      activity,
      createActivityDto,
      { subcategory },
      { updatedId: user.id },
    );

    return await this.activityRepository.save(activity);
  }

  async deleteActivity(id: string) {
    const activity = await this.getActivity(id);
    return await this.activityRepository.remove(activity);
  }

  async registerActivity(id: string, user: User) {
    const activity = await this.getActivity(id);

    await this.checkParticipants(ActivityActionEnum.Register, activity);

    await this.activityRepository.manager.transaction(async (manager) => {
      await this.userActivitiesService.registerUserActivity(
        { activity, user },
        manager,
      );
      const participants = await this.userActivitiesService.getParticipants(
        id,
        manager,
      );

      await manager.update(
        Activity,
        { id },
        { participants: participants.length },
      );
    });
  }

  async cancelActivity(id: string, user: User) {
    const activity = await this.getActivity(id);
    await this.checkParticipants(ActivityActionEnum.Cancel, activity);

    await this.activityRepository.manager.transaction(async (manager) => {
      await this.userActivitiesService.cancelUserActivity(
        { activity, user },
        manager,
      );

      const participants = await this.userActivitiesService.getParticipants(
        id,
        manager,
      );

      await manager.update(
        Activity,
        { id },
        { participants: participants.length },
      );
    });
  }

  async checkParticipants(
    action: ActivityActionEnum,
    activityDto: ActivityDto,
  ) {
    if (
      action === ActivityActionEnum.Register &&
      activityDto.participants >= activityDto.maxParticipants &&
      activityDto.maxParticipants !== -1
    ) {
      throw new BadRequestException('Activity participants is full');
    }

    if (activityDto.isExpired) {
      throw new BadRequestException('Activity is expired');
    }

    if (activityDto.isRegistrationExpired) {
      throw new BadRequestException('Activity registration is expired');
    }
  }
}
