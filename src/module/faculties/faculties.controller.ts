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
import { FacultiesService } from './faculties.service';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessage } from 'src/decorator/respone-message.decorator';
import { FacultyDto } from './dto/faculty.dto';

@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Faculties retrieved successfully')
  async getFaculties() {
    return await this.facultiesService.getFaculties();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Faculty retrieved successfully')
  async getFaculty(@Param('id') id: string) {
    return await this.facultiesService.getFaculty(id);
  }

  @Get('/:code')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Faculty retrieved successfully')
  async getFacultyByCode(@Param('code') code: string) {
    return await this.facultiesService.getFacultyByCode(code);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Faculty created successfully')
  async createFaculty(@Body() facultyDto: FacultyDto) {
    return await this.facultiesService.createFaculty(facultyDto);
  }

  @Post('bulk')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Faculties created successfully')
  async createFaculties(@Body() facultyDtos: FacultyDto[]) {
    return await this.facultiesService.createFaculties(facultyDtos);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Faculty updated successfully')
  async updateFaculty(@Param('id') id: string, @Body() facultyDto: FacultyDto) {
    return await this.facultiesService.updateFaculty(id, facultyDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Faculty deleted successfully')
  async deleteFaculty(@Param('id') id: string) {
    return await this.facultiesService.deleteFaculty(id);
  }
}
