import { CloudinaryModule } from './module/cloudinary/cloudinary.module';
import { ProofsModule } from './module/proof/proofs.module';
import { UserActivitiesModule } from './module/user-activities/user-activities.module';
import { ActivitiesModule } from './module/activities/activities.module';
import { CategoriesModule } from './module/categories/categories.module';
import { RolesModule } from './module/roles/roles.module';
import { ImportsModule } from './module/imports/imports.module';
import { FacultiesModule } from './module/faculties/faculties.module';
import { AcademicYearsModule } from './module/academic-years/academic-years.module';
import { ClazzesModule } from './module/clazzes/clazzes.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import { UsersModule } from './module/users/users.module';
import { MailModule } from './module/mail/mail.module';

@Module({
  imports: [
    MailModule,
    CloudinaryModule,
    ProofsModule,
    UserActivitiesModule,
    ActivitiesModule,
    CategoriesModule,
    AuthModule,
    UsersModule,
    FacultiesModule,
    ClazzesModule,
    AcademicYearsModule,
    RolesModule,
    ImportsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig,
    }),
  ],
})
export class AppModule {}
