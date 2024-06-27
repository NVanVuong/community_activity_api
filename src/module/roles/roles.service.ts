import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { RoleDto } from './dto/roles.dto';
import { Role } from 'src/entity/role.entity';
import { RoleEnum } from 'src/common/enum/role.enum';
import { Subcategory } from 'src/entity/subcategory.entity';
import { AddSubcategoriesDto } from '../organization/dto/organization.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  async getRoles(keyword: string = '') {
    return await this.rolesRepository.find({
      relations: ['subcategories'],
      where: [{ description: ILike(`%${keyword}%`) }],
    });
  }

  async getRole(id: string) {
    return await this.rolesRepository.findOne({ where: { id } });
  }

  async getRoleByName(name: RoleEnum) {
    return await this.rolesRepository.findOne({ where: { name } });
  }

  async createRole(roleDto: RoleDto) {
    const role = this.rolesRepository.create(roleDto);
    role.id = roleDto.name;
    return this.rolesRepository.save(role);
  }

  async updateRole(id: string, roleDto: RoleDto) {
    const role = await this.rolesRepository.findOneBy({ id });
    if (!role) {
      throw new Error('Role not found');
    }
    Object.assign(role, roleDto);
    return this.rolesRepository.save(role);
  }

  async deleteRole(id: string) {
    const role = await this.rolesRepository.findOne({ where: { id } });

    if (!role) {
      throw new Error('Role not found');
    }

    return await this.rolesRepository.remove(role);
  }

  async addSubcategoriesToRole(
    id: string,
    addSubcategoriesDto: AddSubcategoriesDto,
  ) {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['subcategories'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    const subcategories = await this.subcategoryRepository.findBy({
      id: In(addSubcategoriesDto.subcategoryIds),
    });

    const newSubcategories = subcategories.filter(
      (subcategory) =>
        !role.subcategories.some(
          (existingSubcategory) => existingSubcategory.id === subcategory.id,
        ),
    );

    role.subcategories.push(...newSubcategories);
    return this.rolesRepository.save(role);
  }

  async getRoleSubcategories(id: string) {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['subcategories'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role.subcategories;
  }
}
