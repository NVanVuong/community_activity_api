import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Subcategory } from 'src/entity/subcategory.entity';

import { Organization } from 'src/entity/organization.entity';
import {
  AddSubcategoriesDto,
  CreateOrganizationDto,
} from './dto/organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  async getOrganizations(keyword: string = '') {
    return this.organizationRepository.find({
      relations: ['subcategories'],
      where: [{ name: ILike(`%${keyword}%`) }],
    });
  }

  async getOrganization(id: string) {
    return this.organizationRepository.findOne({ where: { id } });
  }

  async createOrganization(createOrganizationDto: CreateOrganizationDto) {
    const organization = this.organizationRepository.create(
      createOrganizationDto,
    );
    return this.organizationRepository.save(organization);
  }

  async addSubcategoriesToOrganization(
    id: string,
    addSubcategoriesDto: AddSubcategoriesDto,
  ) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: ['subcategories'],
    });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    const subcategories = await this.subcategoryRepository.findBy({
      id: In(addSubcategoriesDto.subcategoryIds),
    });

    const newSubcategories = subcategories.filter(
      (subcategory) =>
        !organization.subcategories.some(
          (existingSubcategory) => existingSubcategory.id === subcategory.id,
        ),
    );

    organization.subcategories.push(...newSubcategories);
    return this.organizationRepository.save(organization);
  }

  async getOrganizationSubcategories(id: string) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: ['subcategories'],
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return organization.subcategories;
  }

  async deleteOrganization(id: string) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return this.organizationRepository.remove(organization);
  }
}
