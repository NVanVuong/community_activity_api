import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClazzesService } from './clazzes.service';
import { ClazzDto } from './dto/clazz.dto';
import { ResponseMessage } from 'src/decorator/respone-message.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { User } from 'src/entity/user.entity';

@Controller('classes')
export class ClazzesController {
  constructor(private clazzesService: ClazzesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Classes retrieved successfully')
  getClazzes(@CurrentUser() user: User, @Query('keyword') keyword: string) {
    return this.clazzesService.getClazzes(user, keyword);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Class retrieved successfully')
  getClazz(id: string) {
    return this.clazzesService.getClazz(id);
  }

  @Get(':name')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Class retrieved successfully')
  getClazzByName(name: string) {
    return this.clazzesService.getClazzByName(name);
  }

  @Get('faculty/:facultyId')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Classes retrieved successfully')
  getClazzesByFaculty(@Param('facultyId') facultyId: string) {
    return this.clazzesService.getClazzesByFaculty(facultyId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Class created successfully')
  createClazz(@Body() clazzDto: ClazzDto) {
    return this.clazzesService.createClazz(clazzDto);
  }

  @Post('bulk')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Classes created successfully')
  createClazzes(@Body() clazzesDto: ClazzDto[]) {
    return this.clazzesService.createClazzes(clazzesDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Class updated successfully')
  updateClazz(@Param('id') id: string, @Body() clazzDto: ClazzDto) {
    return this.clazzesService.updateClazz(id, clazzDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Class deleted successfully')
  deleteClazz(@Param('id') id: string) {
    return this.clazzesService.deleteClazz(id);
  }
}
