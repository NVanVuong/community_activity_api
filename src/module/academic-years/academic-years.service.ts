import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcademicYear } from 'src/entity/academic-year.entity';
import { Repository } from 'typeorm';
import { AcademicYearDto } from './dto/academic-year.dto';

@Injectable()
export class AcademicYearsService {
  constructor(
    @InjectRepository(AcademicYear)
    private academicYearsRepository: Repository<AcademicYear>,
  ) {}
  async getAcademicYears() {
    return await this.academicYearsRepository.find();
  }

  async getAcademicYear(id: string) {
    const academicYear = await this.academicYearsRepository.findOne({
      where: { id },
    });
    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }
    return academicYear;
  }

  async getAcademicYearByStartYear(startYear: number) {
    return await this.academicYearsRepository.findOne({ where: { startYear } });
  }

  async getAcademicYearByCode(code: string) {
    return await this.academicYearsRepository.findOne({ where: { code } });
  }

  async createAcademicYear(academicYearDto: AcademicYearDto) {
    try {
      return await this.academicYearsRepository.save(academicYearDto);
    } catch (error) {
      if (error.code === '23505') {
        if (error.detail.includes('code')) {
          throw new BadRequestException('Academic year code already exists');
        } else if (error.detail.includes('name')) {
          throw new BadRequestException('Academic year name already exists');
        } else if (error.detail.includes('startYear')) {
          throw new BadRequestException('Academic year start already exists');
        }
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateAcademicYear(id: string, academicYearDto: AcademicYearDto) {
    const academicYear = await this.academicYearsRepository.findOne({
      where: { id },
    });

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    Object.assign(academicYear, academicYearDto);

    return await this.academicYearsRepository.save(academicYear);
  }

  async deleteAcademicYear(id: string) {
    const academicYear = await this.academicYearsRepository.findOne({
      where: { id },
    });

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    return await this.academicYearsRepository.delete(id);
  }
}
