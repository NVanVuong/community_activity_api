import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleDto } from './dto/roles.dto';
import { Role } from 'src/entity/role.entity';
import { RoleEnum } from 'src/common/enum/role.enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async getRoles() {
    return await this.rolesRepository.find();
  }

  async getRole(id: string) {
    return await this.rolesRepository.findOne({ where: { id } });
  }

  async getRoleByName(name: RoleEnum) {
    return await this.rolesRepository.findOne({ where: { name } });
  }

  async createRole(roleDto: RoleDto) {
    const role = this.rolesRepository.create(roleDto);
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
}
