import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleDto } from './dto/roles.dto';
import { ResponseMessage } from 'src/decorator/respone-message.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Roles retrieved successfully')
  async getRoles() {
    return await this.rolesService.getRoles();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Role retrieved successfully')
  async getRole(id: string) {
    return await this.rolesService.getRole(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Role created successfully')
  async createRole(@Body() roleDto: RoleDto) {
    return await this.rolesService.createRole(roleDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Role updated successfully')
  async updateRole(@Param('id') id: string, @Body() roleDto: RoleDto) {
    return await this.rolesService.updateRole(id, roleDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Role deleted successfully')
  async deleteRole(@Param('id') id: string) {
    return await this.rolesService.deleteRole(id);
  }
}
