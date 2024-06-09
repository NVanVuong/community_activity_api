import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from 'src/common/enum/role.enum';
import { Proof } from 'src/entity/proof.entity';
import { ILike, Repository } from 'typeorm';
import { CreateProofDto } from './dto/create-proof.dto';
import { UserActivityStatusEnum } from 'src/common/enum/status.enum';
import { User } from 'src/entity/user.entity';
import { UserActivity } from 'src/entity/user-activity.entity';
import { Activity } from 'src/entity/activity.entity';

@Injectable()
export class ProofsService {
  constructor(
    @InjectRepository(Proof)
    private proofsRepository: Repository<Proof>,
  ) {}

  async getProofs(keyword: string = '') {
    const proofs = await this.proofsRepository.find({
      relations: ['userActivity.user', 'userActivity.user.clazz.faculty'],
      where: [
        { name: ILike(`%${keyword}%`) },
        { userActivity: { user: { name: ILike(`%${keyword}%`) } } },
      ],
    });

    return proofs;
  }

  async getProof(id: string) {
    const proof = await this.proofsRepository.findOne({ where: { id } });

    if (!proof) {
      throw new BadRequestException('Proof not found');
    }

    return proof;
  }

  async getProofByUserActivity(userActivityId: string) {
    const proofs = this.proofsRepository.findOne({
      where: { userActivity: { id: userActivityId } },
    });

    if (!proofs) {
      throw new BadRequestException('Proof not found');
    }

    return proofs;
  }

  async getProofsOfUser(userId: string) {
    return this.proofsRepository.find({
      where: { userActivity: { user: { id: userId } } },
    });
  }

  async getProofsOfClass(clazzId: string) {
    return this.proofsRepository.find({
      where: {
        userActivity: {
          user: { clazz: { id: clazzId }, role: RoleEnum.USER },
        },
      },
    });
  }

  async getProofsOfFaculty(facultyId: string) {
    return this.proofsRepository.find({
      where: {
        userActivity: {
          user: { clazz: { faculty: { id: facultyId } }, role: RoleEnum.USER },
        },
      },
    });
  }

  async submitProof(userActivityId: string, createProofDto: CreateProofDto) {
    await this.proofsRepository.manager.transaction(
      async (transactionManager) => {
        const userActivity = await transactionManager.findOne(UserActivity, {
          where: { id: userActivityId },
        });

        if (!userActivity) {
          throw new Error('User activity not found');
        }

        const proof = transactionManager.create(Proof, {
          ...createProofDto,
          userActivity,
        });

        userActivity.status = UserActivityStatusEnum.SubmittedProof;

        await transactionManager.save(UserActivity, userActivity);
        return await transactionManager.save(Proof, proof);
      },
    );
  }

  async submitProofForExternalActivity(
    createProofDto: CreateProofDto,
    user: User,
  ) {
    await this.proofsRepository.manager.transaction(async (manager) => {
      const activity = manager.create(Activity, {
        ...createProofDto,
        createdId: user.id,
        isExternal: true,
      });

      await manager.save(Activity, activity);

      const userActivity = manager.create(UserActivity, {
        user,
        activity,
        status: UserActivityStatusEnum.SubmittedProof,
      });

      await manager.save(UserActivity, userActivity);

      const proof = manager.create(Proof, {
        ...createProofDto,
        userActivity,
      });

      return await manager.save(Proof, proof);
    });
  }

  async approveProof(id: string) {
    await this.proofsRepository.manager.transaction(async (manager) => {
      const proof = await manager.findOne(Proof, {
        where: { id },
        relations: ['userActivity', 'userActivity.user'],
      });

      if (proof.userActivity.status !== UserActivityStatusEnum.SubmittedProof) {
        throw new BadRequestException('Proof is not submitted');
      }

      proof.userActivity.status = UserActivityStatusEnum.Approved;
      await manager.save(UserActivity, proof.userActivity);

      proof.userActivity.user.score += proof.userActivity.activity.score;
      await manager.save(User, proof.userActivity.user);

      return await manager.save(Proof, proof);
    });
  }

  async rejectProof(id: string, comment: string) {
    await this.proofsRepository.manager.transaction(async (manager) => {
      const proof = await this.getProof(id);

      if (proof.userActivity.status !== UserActivityStatusEnum.SubmittedProof) {
        throw new BadRequestException('Proof is not submitted');
      }

      proof.userActivity.status = UserActivityStatusEnum.Rejected;
      proof.comment = comment;

      await manager.save(UserActivity, proof.userActivity);

      return await manager.save(Proof, proof);
    });
  }

  async resubmitProof(id: string, createProofDto: CreateProofDto) {
    await this.proofsRepository.manager.transaction(async (manager) => {
      const proof = await this.getProof(id);

      if (proof.userActivity.status !== UserActivityStatusEnum.Rejected) {
        throw new BadRequestException('Proof is not rejected');
      }

      proof.userActivity.status = UserActivityStatusEnum.SubmittedProof;

      Object.assign(proof, createProofDto);

      await manager.save(UserActivity, proof.userActivity);
      return await manager.save(Proof, proof);
    });
  }

  async deleteProof(id: string) {
    await this.proofsRepository.manager.transaction(async (manager) => {
      const proof = await this.getProof(id);

      if (proof.userActivity.status === UserActivityStatusEnum.Approved) {
        throw new BadRequestException('Proof is already approved');
      }

      proof.userActivity.status = UserActivityStatusEnum.Registered;

      await manager.save(UserActivity, proof.userActivity);
      return await manager.remove(Proof, proof);
    });
  }
}
