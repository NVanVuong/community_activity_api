import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserActivity } from 'src/entity/user-activity.entity';
import { EntityManager, Not, Repository } from 'typeorm';
import { UserActivityDto } from './dto/user-activity.dto';
import { UserActivityStatusEnum } from 'src/common/enum/status.enum';

@Injectable()
export class UserActivitiesService {
  constructor(
    @InjectRepository(UserActivity)
    private userActivityRepository: Repository<UserActivity>,
  ) {}

  async getUserActivities(id: string) {
    return this.userActivityRepository.find({
      where: { user: { id } },
    });
  }

  async getUserActivity(id: string) {
    return this.userActivityRepository.findOne({ where: { id } });
  }

  async getParticipants(activityId: string, manager?: EntityManager) {
    if (!manager) {
      manager = this.userActivityRepository.manager;
    }

    const participants = await manager.find(UserActivity, {
      where: {
        activity: { id: activityId },
        status: Not(UserActivityStatusEnum.Canceled),
      },
    });

    return participants;
  }

  async registerUserActivity(
    userActivityDto: UserActivityDto,
    manager: EntityManager,
  ) {
    const { user, activity } = userActivityDto;

    return manager.transaction(async (transactionalManager) => {
      const userActivity = await transactionalManager.findOne(UserActivity, {
        where: { user: { id: user.id }, activity: { id: activity.id } },
      });

      if (!userActivity) {
        const newUserActivity = this.userActivityRepository.create({
          user,
          activity,
          status: UserActivityStatusEnum.Registered,
        });

        return transactionalManager.save(newUserActivity);
      }

      if (userActivity.status === UserActivityStatusEnum.Canceled) {
        await transactionalManager.update(UserActivity, userActivity.id, {
          status: UserActivityStatusEnum.Registered,
        });
        return userActivity;
      } else {
        throw new BadRequestException(
          'User is already registered in this activity',
        );
      }
    });
  }

  async cancelUserActivity(
    userActivityDto: UserActivityDto,
    manager: EntityManager,
  ) {
    const { user, activity } = userActivityDto;

    const userActivity = await manager.findOne(UserActivity, {
      where: { user: { id: user.id }, activity: { id: activity.id } },
    });

    if (!userActivity) {
      throw new BadRequestException('User is not registered in this activity');
    }

    if (userActivity.status === UserActivityStatusEnum.Canceled) {
      throw new BadRequestException('User has already canceled this activity');
    }

    userActivity.status = UserActivityStatusEnum.Canceled;

    return manager.save(userActivity);
  }
}
