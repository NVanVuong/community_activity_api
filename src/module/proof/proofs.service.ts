import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from 'src/common/enum/role.enum';
import { Proof } from 'src/entity/proof.entity';
import { ILike, In, Repository } from 'typeorm';
import { CreateProofDto } from './dto/create-proof.dto';
import { UserActivityStatusEnum } from 'src/common/enum/status.enum';
import { User } from 'src/entity/user.entity';
import { UserActivity } from 'src/entity/user-activity.entity';
import { Activity } from 'src/entity/activity.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Subcategory } from 'src/entity/subcategory.entity';
import { MailService } from '../mail/mail.service';
import { Comment } from 'src/entity/comment.entity';
import { Role } from 'src/entity/role.entity';

@Injectable()
export class ProofsService {
  constructor(
    @InjectRepository(Proof)
    private proofsRepository: Repository<Proof>,
    private cloudinaryService: CloudinaryService,
    private mailService: MailService,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getProofs(currentUser: User, keyword: string = '') {
    const roleSubcategories = await this.roleRepository.findOne({
      where: { id: currentUser.role.id },
      relations: ['subcategories'],
    });

    const subcategoryIds = roleSubcategories.subcategories.map((sub) => sub.id);

    let where: any = [
      {
        name: ILike(`%${keyword}%`),
        userActivity: {
          user: { name: ILike(`%${keyword}%`) },
          activity: { subcategory: { id: In(subcategoryIds) } },
        },
      },
    ];

    switch (currentUser.role.name) {
      case RoleEnum.ADMIN:
      case RoleEnum.YOUTH_UNION:
        break;

      case RoleEnum.FACULTY:
      case RoleEnum.UNION_BRANCH:
        where = where.map((condition) => ({
          ...condition,
          userActivity: {
            ...condition.userActivity,
            user: {
              ...condition.userActivity.user,
              clazz: { faculty: { id: currentUser.faculty.id } },
            },
          },
        }));
        break;

      case RoleEnum.CLASS:
        where = where.map((condition) => ({
          ...condition,
          userActivity: {
            ...condition.userActivity,
            user: { clazz: { id: currentUser.clazz.id } },
          },
        }));
        break;

      case RoleEnum.USER:
      default:
        where = where.map((condition) => ({
          ...condition,
          userActivity: {
            ...condition.userActivity,
            user: { id: currentUser.id },
          },
        }));
        break;
    }

    const proofs = await this.proofsRepository.find({
      relations: [
        'userActivity.user',
        'userActivity.user.clazz.faculty',
        'userActivity.activity.subcategory',
      ],
      where,
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

  async getMyProofs(userId: string, keyword: string = '') {
    return this.proofsRepository.find({
      relations: ['userActivity.activity.subcategory'],
      where: {
        name: ILike(`%${keyword}%`),
        userActivity: { user: { id: userId } },
      },
    });
  }

  async getProofsOfClass(clazzId: string) {
    return this.proofsRepository.find({
      where: {
        userActivity: {
          user: {
            clazz: { id: clazzId },
            role: {
              name: RoleEnum.USER,
            },
          },
        },
      },
    });
  }

  async getProofsOfFaculty(facultyId: string) {
    return this.proofsRepository.find({
      where: {
        userActivity: {
          user: {
            clazz: { faculty: { id: facultyId } },
            role: {
              name: RoleEnum.USER,
            },
          },
        },
      },
    });
  }

  async submitProof(
    userActivityId: string,
    createProofDto: CreateProofDto,
    file: Express.Multer.File,
  ) {
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

        if (file) {
          const imageUrl = await this.cloudinaryService.uploadImage(file);
          proof.image = imageUrl;
        }

        userActivity.status = UserActivityStatusEnum.Submitted;

        await transactionManager.save(UserActivity, userActivity);
        return await transactionManager.save(Proof, proof);
      },
    );
  }

  async submitProofForExternalActivity(
    createProofDto: CreateProofDto,
    user: User,
    file: Express.Multer.File,
  ) {
    await this.proofsRepository.manager.transaction(async (manager) => {
      const subcategory = await manager.findOne(Subcategory, {
        where: { id: createProofDto.subcategoryId },
      });

      const activity = manager.create(Activity, {
        ...createProofDto,
        subcategory,
        createdId: user.id,
        isExternal: true,
      });

      await manager.save(Activity, activity);

      const userActivity = manager.create(UserActivity, {
        user,
        activity,
        status: UserActivityStatusEnum.Submitted,
      });

      await manager.save(UserActivity, userActivity);

      const proof = manager.create(Proof, {
        ...createProofDto,
        userActivity,
      });

      if (file) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        proof.image = imageUrl;
        activity.image = imageUrl;
      }

      await manager.save(Activity, activity);

      return await manager.save(Proof, proof);
    });
  }

  async approveProof(user: User, id: string, commentContent?: string) {
    await this.proofsRepository.manager.transaction(async (manager) => {
      const proof = await manager.findOne(Proof, {
        where: { id },
        relations: ['userActivity', 'userActivity.user'],
      });

      if (proof.userActivity.status !== UserActivityStatusEnum.Submitted) {
        throw new BadRequestException('Proof is not submitted');
      }

      proof.userActivity.status = UserActivityStatusEnum.Approved;

      if (commentContent) {
        const comment = new Comment();
        comment.content = commentContent;
        comment.proof = proof;
        comment.user = user;

        const newComment = await manager.save(Comment, comment);
        proof.comments.push(newComment);
      }

      await manager.save(UserActivity, proof.userActivity);

      proof.userActivity.user.score += proof.userActivity.activity.score;
      await manager.save(User, proof.userActivity.user);

      await manager.save(Proof, proof);

      await this.mailService.sendProofApprovalEmail(
        proof.userActivity.user,
        proof,
      );
    });
  }

  async rejectProof(user: User, id: string, commentContent: string) {
    await this.proofsRepository.manager.transaction(async (manager) => {
      const proof = await manager.findOne(Proof, {
        where: { id },
        relations: ['userActivity', 'userActivity.user'],
      });

      if (proof.userActivity.status !== UserActivityStatusEnum.Submitted) {
        throw new BadRequestException('Proof is not submitted');
      }

      proof.userActivity.status = UserActivityStatusEnum.Rejected;

      if (!commentContent) {
        throw new BadRequestException('Comment is required to reject proof');
      }

      const comment = new Comment();
      comment.content = commentContent;
      comment.proof = proof;
      comment.user = user;
      const newComment = await manager.save(Comment, comment);
      proof.comments.push(newComment);

      await manager.save(UserActivity, proof.userActivity);

      await manager.save(Proof, proof);

      await this.mailService.sendProofRejectionEmail(
        proof.userActivity.user,
        proof,
        commentContent,
      );
    });
  }

  async resubmitProof(id: string, createProofDto: CreateProofDto) {
    await this.proofsRepository.manager.transaction(async (manager) => {
      const proof = await this.getProof(id);

      if (proof.userActivity.status !== UserActivityStatusEnum.Rejected) {
        throw new BadRequestException('Proof is not rejected');
      }

      proof.userActivity.status = UserActivityStatusEnum.Submitted;

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
