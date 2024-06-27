import { TypeOrmModule } from '@nestjs/typeorm';
import { ProofsController } from './proofs.controller';
import { ProofsService } from './proofs.service';
import { Module } from '@nestjs/common';
import { Proof } from 'src/entity/proof.entity';
import { UserActivitiesModule } from '../user-activities/user-activities.module';
import { ActivitiesModule } from '../activities/activities.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { UserActivity } from 'src/entity/user-activity.entity';
import { User } from 'src/entity/user.entity';
import { Activity } from 'src/entity/activity.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Subcategory } from 'src/entity/subcategory.entity';
import { Comment } from 'src/entity/comment.entity';
import { RolesModule } from '../roles/roles.module';
import { Role } from 'src/entity/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Proof,
      UserActivity,
      User,
      Activity,
      Subcategory,
      Comment,
      Role,
    ]),
    AuthModule,
    UserActivitiesModule,
    ActivitiesModule,
    UsersModule,
    CloudinaryModule,
    RolesModule,
  ],
  controllers: [ProofsController],
  providers: [ProofsService],
})
export class ProofsModule {}
