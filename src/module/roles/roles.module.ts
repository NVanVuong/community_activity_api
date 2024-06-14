import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entity/role.entity';
import { AuthModule } from '../auth/auth.module';
import { Subcategory } from 'src/entity/subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Subcategory]), AuthModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
