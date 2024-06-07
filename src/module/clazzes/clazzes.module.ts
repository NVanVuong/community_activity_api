import { Module } from '@nestjs/common';
import { ClazzesService } from './clazzes.service';
import { ClazzesController } from './clazzes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clazz } from 'src/entity/clazz.entity';
import { AuthModule } from '../auth/auth.module';
import { FacultiesModule } from '../faculties/faculties.module';
import { AcademicYearsModule } from '../academic-years/academic-years.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Clazz]),
    AuthModule,
    FacultiesModule,
    AcademicYearsModule,
  ],
  controllers: [ClazzesController],
  providers: [ClazzesService],
  exports: [ClazzesService],
})
export class ClazzesModule {}
