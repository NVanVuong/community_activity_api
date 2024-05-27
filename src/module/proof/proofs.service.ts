import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from 'src/common/enum/role.enum';
import { Proof } from 'src/entity/proof.entity';
import { Repository } from 'typeorm';
import { CreateProofDto } from './dto/create-proof.dto';
import { UserActivitiesService } from '../user-activities/user-activities.service';
import { UserActivityStatusEnum } from 'src/common/enum/status.enum';
import { ActivitiesService } from '../activities/activities.service';
import { User } from 'src/entity/user.entity';

@Injectable()
export class ProofsService {
  constructor(
    @InjectRepository(Proof)
    private proofsRepository: Repository<Proof>,
    private userActivitiesService: UserActivitiesService,
    private activitiesService: ActivitiesService,
  ) {}

  async getProofs() {
    return this.proofsRepository.find();
  }

  async getProof(id: string) {
    const proof = await this.proofsRepository.findOne({ where: { id } });

    if (!proof) {
      throw new BadRequestException('Proof not found');
    }

    return proof;
  }

  async getProofByUserActivityId(userActivityId: string) {
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
    const userActivity =
      await this.userActivitiesService.getUserActivity(userActivityId);

    const proof = this.proofsRepository.create({
      ...createProofDto,
      userActivity,
    });

    await this.proofsRepository.save(proof);

    await this.userActivitiesService.changeStatusUserActivity(
      userActivity,
      UserActivityStatusEnum.SubmittedProof,
    );
  }

  async submitProofForExternalActivity(
    createProofDto: CreateProofDto,
    user: User,
  ) {
    console.log(user);

    await this.proofsRepository.manager.transaction(async (manager) => {
      const activity = await this.activitiesService.createExternalActivity(
        createProofDto,
        user,
      );

      const userActivity =
        await this.userActivitiesService.createUserActivityForExternalActivity({
          user,
          activity,
        });

      const proof = manager.create(Proof, {
        ...createProofDto,
        userActivity,
      });

      await manager.save(Proof, proof);
    });
  }
}
