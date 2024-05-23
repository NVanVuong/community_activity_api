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

@Module({
  imports: [
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
