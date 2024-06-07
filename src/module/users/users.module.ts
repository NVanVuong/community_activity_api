import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { AuthModule } from '../auth/auth.module';
import { FacultiesModule } from '../faculties/faculties.module';
import { ClazzesModule } from '../clazzes/clazzes.module';
import { RolesModule } from '../roles/roles.module';
import { UserActivitiesModule } from '../user-activities/user-activities.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    FacultiesModule,
    ClazzesModule,
    RolesModule,
    UserActivitiesModule,
    CloudinaryModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
