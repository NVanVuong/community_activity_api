import { TypeOrmModule } from '@nestjs/typeorm';
import { FacultiesController } from './faculties.controller';
import { FacultiesService } from './faculties.service';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { Faculty } from 'src/entity/faculty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Faculty]), AuthModule],
  controllers: [FacultiesController],
  providers: [FacultiesService],
  exports: [FacultiesService],
})
export class FacultiesModule {}
