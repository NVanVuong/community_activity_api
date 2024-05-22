import { Faculty } from 'src/entity/faculty.entity';
import { AcademicYearsModule } from '../academic-years/academic-years.module';
import { ClazzesModule } from '../clazzes/clazzes.module';
import { FacultiesModule } from '../faculties/faculties.module';
import { ImportsController } from './imports.controller';
import { ImportsService } from './imports.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicYear } from 'src/entity/academic-year.entity';
import { Clazz } from 'src/entity/clazz.entity';
import { User } from 'src/entity/user.entity';
import { Role } from 'src/entity/role.entity';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Clazz, Faculty, AcademicYear, User, Role]),
    ClazzesModule,
    FacultiesModule,
    AcademicYearsModule,
    UsersModule,
    RolesModule,
    AuthModule,
  ],
  controllers: [ImportsController],
  providers: [ImportsService],
})
export class ImportsModule {}
