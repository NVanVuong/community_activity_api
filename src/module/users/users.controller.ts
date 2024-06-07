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
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/decorator/respone-message.decorator';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { User } from 'src/entity/user.entity';
import { Roles } from 'src/decorator/roles.decorator';
import { RoleEnum } from 'src/common/enum/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Get('class/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(RoleEnum.CLASS)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Users retrieved successfully')
  async getUsersByClazz(@Param('id') id: string) {
    return await this.usersService.getUsersByClazz(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Users retrieved successfully')
  async getUsers(@Query('keyword') keyword: string): Promise<User[]> {
    return this.usersService.getUsers(keyword);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('User created successfully')
  @UseInterceptors(FileInterceptor('avatar'))
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.createUser(createUserDto, file);
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

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResponseMessage('User deleted successfully')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get('me/info')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User retrieved successfully')
  async getMyÌno(@CurrentUser() user: User) {
    return this.usersService.getMyInfo(user.id);
  }

  @Put('/me/update')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Your information updated successfully')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateMyInfo(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateMyInfo(user, updateUserDto, file);
  }

  @Put('me/password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Your password updated successfully')
  async updateMyPassword(
    @CurrentUser() user: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updateMyPassword(user, updatePasswordDto);
  }
}
