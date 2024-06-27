import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/entity/activity.entity';
import { ILike, In, Repository } from 'typeorm';
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
import { Role } from 'src/entity/role.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    private categoriesService: CategoriesService,
    private userActivitiesService: UserActivitiesService,
    private cloudinaryService: CloudinaryService,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getActivities(currentUser: User, keyword: string) {
    const roleSubcategories = await this.roleRepository.findOne({
      where: { id: currentUser.role.id },
      relations: ['subcategories'],
    });

    const subcategoryIds = roleSubcategories.subcategories.map((sub) => sub.id);

    const where: any[] = [];

    if (currentUser.role.name === RoleEnum.CLASS) {
      return [];
    }

    const allowedOrganizations = [
      'Đại học Đà Nẵng',
      'Đại học Bách Khoa',
      currentUser?.clazz?.faculty?.name,
    ];

    switch (currentUser.role.name) {
      case RoleEnum.ADMIN:
      case RoleEnum.YOUTH_UNION:
      case RoleEnum.FACULTY:
      case RoleEnum.UNION_BRANCH:
        where.push(
          {
            name: ILike(`%${keyword}%`),
            createdId: currentUser.id,
          },
          {
            name: ILike(`%${keyword}%`),
            isExternal: true,
            subcategory: { id: In(subcategoryIds) },
          },
        );
        break;

      case RoleEnum.USER:
      default:
        where.push({
          name: ILike(`%${keyword}%`),
          isExternal: false,
          organization: In(allowedOrganizations),
        });
        break;
    }

    const activities = await this.activityRepository.find({
      where,
      relations: [
        'userActivities',
        'userActivities.user',
        'userActivities.user.clazz.faculty',
        'subcategory',
        'subcategory.category',
      ],
      order: { createdAt: 'DESC' },
    });

    const currentDate = new Date();
    const activityDtos = activities.map((activity) => {
      const activityDto = plainToInstance(ActivityDto, activity);

      if (currentUser.role.name === RoleEnum.USER) {
        const isRegistered = activity.userActivities.some(
          (ua) =>
            ua.user.id === currentUser.id &&
            ua.status !== UserActivityStatusEnum.Canceled,
        );

        if (isRegistered) {
          activityDto.status = ActivityStatusEnum.Registered;
        } else if (currentDate > activity.endDate) {
          activityDto.status = ActivityStatusEnum.Completed;
        } else if (currentDate > activity.endRegistration) {
          activityDto.status = ActivityStatusEnum.RegistrationExpired;
        } else if (
          activity.participants >= activity.maxParticipants &&
          activity.maxParticipants !== -1
        ) {
          activityDto.status = ActivityStatusEnum.Full;
        } else {
          activityDto.status = ActivityStatusEnum.RegistrationOpen;
        }
      } else {
        if (currentDate > activity.endDate) {
          activityDto.status = ActivityStatusEnum.Completed;
        } else if (currentDate > activity.endRegistration) {
          activityDto.status = ActivityStatusEnum.RegistrationExpired;
        } else if (
          activity.participants >= activity.maxParticipants &&
          activity.maxParticipants !== -1
        ) {
          activityDto.status = ActivityStatusEnum.Full;
        } else {
          activityDto.status = ActivityStatusEnum.RegistrationOpen;
        }
      }

      return activityDto;
    });

    return activityDtos;
  }

  async getParticipants(activityId: string) {
    return this.userActivitiesService.getParticipants(activityId);
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
      activityDto.status = ActivityStatusEnum.Completed;
    } else if (currentDate > activity.endRegistration) {
      activityDto.status = ActivityStatusEnum.RegistrationExpired;
    } else if (
      activity.participants >= activity.maxParticipants &&
      activity.maxParticipants !== -1
    ) {
      activityDto.status = ActivityStatusEnum.Full;
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
      activityDto.status === ActivityStatusEnum.Full
    ) {
      throw new BadRequestException('Activity participants is full');
    }

    if (activityDto.status === ActivityStatusEnum.Completed) {
      throw new BadRequestException('Activity has already ended');
    }

    if (activityDto.status === ActivityStatusEnum.RegistrationExpired) {
      throw new BadRequestException('Activity registration is expired');
    }
  }
}
