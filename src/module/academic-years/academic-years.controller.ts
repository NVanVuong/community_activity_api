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
import { AcademicYearsService } from './academic-years.service';
import { AcademicYearDto } from './dto/academic-year.dto';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessage } from 'src/decorator/respone-message.decorator';

@Controller('academic-years')
export class AcademicYearsController {
  constructor(private academicYearsService: AcademicYearsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Academic years retrieved successfully')
  async getAcademicYears() {
    return await this.academicYearsService.getAcademicYears();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Academic year retrieved successfully')
  async getAcademicYear(id: string) {
    return await this.academicYearsService.getAcademicYear(id);
  }

  @Get('year/:startYear')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Academic year retrieved successfully')
  async getAcademicYearByYear(@Param('startYear') startYear: number) {
    return await this.academicYearsService.getAcademicYearByStartYear(
      startYear,
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Academic year created successfully')
  async createAcademicYear(@Body() academicYearDto: AcademicYearDto) {
    return await this.academicYearsService.createAcademicYear(academicYearDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Academic year updated successfully')
  async updateAcademicYear(
    @Param('id') id: string,
    @Body() academicYearDto: AcademicYearDto,
  ) {
    return await this.academicYearsService.updateAcademicYear(
      id,
      academicYearDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Academic year deleted successfully')
  async deleteAcademicYear(@Param('id') id: string) {
    return await this.academicYearsService.deleteAcademicYear(id);
  }
}
