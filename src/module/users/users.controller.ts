import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/decorator/respone-message.decorator';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { User } from 'src/entity/user.entity';
import { RoleEnum } from '../roles/dto/roles.dto';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User retrieved successfully')
  async getUser(@Param('id') id: string) {
    return await this.usersService.getUser(id);
  }

  @Get('clazz/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(RoleEnum.CLASS)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Users retrieved successfully')
  async getUsersByClazz(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.usersService.getUsersByClazz(id, user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Users retrieved successfully')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('User created successfully')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User updated successfully')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResponseMessage('User deleted successfully')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}