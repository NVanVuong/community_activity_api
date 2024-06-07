import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/entity/activity.entity';
import { ILike, Repository } from 'typeorm';
import { CreateActivityDto } from './dto/create-activity.dto';
import { CategoriesService } from '../categories/categories.service';
import { User } from 'src/entity/user.entity';
import { plainToInstance } from 'class-transformer';
import { ActivityDto } from './dto/activity.dto';
import { UserActivitiesService } from '../user-activities/user-activities.service';
import { ActivityActionEnum } from 'src/common/enum/action.enum';
import {
  ActivityStatusEnum,
  UserActivityStatusEnum,
} from 'src/common/enum/status.enum';
import { RoleEnum } from 'src/common/enum/role.enum';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    private categoriesService: CategoriesService,
    private userActivitiesService: UserActivitiesService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getActivities(user: User, keyword: string) {
    const activities = await this.activityRepository.find({
      where: [{ name: ILike(`%${keyword}%`) }],
      relations: ['userActivities', 'userActivities.user', 'subcategory'],
      order: { createdAt: 'DESC' },
    });

    const currentDate = new Date();
    const activityDtos = activities.map((activity) => {
      const activityDto = plainToInstance(ActivityDto, activity);

      if (user.role === RoleEnum.USER) {
        const isRegistered = activity.userActivities.some(
          (ua) =>
            ua.user.id === user.id &&
            ua.status !== UserActivityStatusEnum.Canceled,
        );

        if (isRegistered) {
          activityDto.status = ActivityStatusEnum.Registered;
        } else {
          activityDto.status = ActivityStatusEnum.RegistrationOpen;
        }
      } else {
        if (currentDate > activity.endDate) {
          activityDto.status = ActivityStatusEnum.Expired;
        } else if (currentDate > activity.endRegistration) {
          activityDto.status = ActivityStatusEnum.RegistrationExpired;
        } else {
          activityDto.status = ActivityStatusEnum.RegistrationOpen;
        }
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

    const currentDate = new Date();

    if (currentDate > activity.endDate) {
      activityDto.status = ActivityStatusEnum.Expired;
    } else if (currentDate > activity.endRegistration) {
      activityDto.status = ActivityStatusEnum.RegistrationExpired;
    } else {
      activityDto.status = ActivityStatusEnum.RegistrationOpen;
    }

    return activityDto;
  }

  async createActivity(
    createActivityDto: CreateActivityDto,
    user: User,
    file?: Express.Multer.File,
  ) {
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

    if (file) {
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      activity.image = imageUrl;
    }

    return this.activityRepository.save(activity);
  }

  async updateActivity(
    id: string,
    createActivityDto: CreateActivityDto,
    user: User,
    file?: Express.Multer.File,
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

    if (file) {
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      activity.image = imageUrl;
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

    if (activityDto.status === ActivityStatusEnum.Expired) {
      throw new BadRequestException('Activity is expired');
    }

    if (activityDto.status === ActivityStatusEnum.RegistrationExpired) {
      throw new BadRequestException('Activity registration is expired');
    }
  }
}
