import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import {
  AddSubcategoriesDto,
  CreateOrganizationDto,
} from './dto/organization.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  async getOrganizations(@Query('keyword') keyword: string = '') {
    return this.organizationsService.getOrganizations(keyword);
  }

  @Get(':id')
  async getOrganization(@Param('id') id: string) {
    return this.organizationsService.getOrganization(id);
  }

  @Post()
  async createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.organizationsService.createOrganization(createOrganizationDto);
  }

  @Post(':id/subcategories')
  async addSubcategoriesToOrganization(
    @Param('id') id: string,
    @Body() addSubcategoriesDto: AddSubcategoriesDto,
  ) {
    return this.organizationsService.addSubcategoriesToOrganization(
      id,
      addSubcategoriesDto,
    );
  }

  @Delete(':id')
  async deleteOrganization(@Param('id') id: string) {
    return this.organizationsService.deleteOrganization(id);
  }
}
