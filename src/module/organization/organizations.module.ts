import { OrganizationsController } from './organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service';
import { Module } from '@nestjs/common';
import { Subcategory } from 'src/entity/subcategory.entity';
import { Organization } from 'src/entity/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Subcategory])],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}
