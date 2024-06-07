import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clazz } from 'src/entity/clazz.entity';
import { ILike, Repository } from 'typeorm';
import { ClazzDto } from './dto/clazz.dto';
import { FacultiesService } from '../faculties/faculties.service';
import { AcademicYearsService } from '../academic-years/academic-years.service';

@Injectable()
export class ClazzesService {
  constructor(
    @InjectRepository(Clazz)
    private readonly clazzRepository: Repository<Clazz>,
    private readonly facultiesService: FacultiesService,
    private readonly academicYearsService: AcademicYearsService,
  ) {}

  async getClazzes(keyword: string) {
    return await this.clazzRepository.find({
      where: [{ name: ILike(`%${keyword}%`) }],
      relations: ['faculty', 'academicYear'],
      order: { faculty: { name: 'ASC' } },
    });
  }

  async getClazz(id: string) {
    return await this.clazzRepository.findOne({ where: { id } });
  }

  async getClazzByName(name: string) {
    return await this.clazzRepository.findOne({ where: { name } });
  }

  async getClazzesByAcademicYear(academicYearId: string) {
    return await this.clazzRepository.find({
      where: { academicYear: { id: academicYearId } },
    });
  }

  async getClazzesByFaculty(facultyId: string) {
    return await this.clazzRepository.find({
      where: { faculty: { id: facultyId } },
      relations: ['academicYear'],
    });
  }

  async createClazz(clazzDto: ClazzDto) {
    try {
      const clazz = await this.clazzRepository.create(clazzDto);

      const faculty = await this.facultiesService.getFaculty(
        clazzDto.facultyId,
      );
      clazz.faculty = faculty;

      const academicYear = await this.academicYearsService.getAcademicYear(
        clazzDto.academicYearId,
      );

      clazz.academicYear = academicYear;

      return await this.clazzRepository.save(clazz);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Class already exists');
      } else throw new InternalServerErrorException();
    }
  }

  async createClazzes(clazzesDto: ClazzDto[]) {
    clazzesDto.forEach(async (clazzDto) => {
      await this.createClazz(clazzDto);
    });
  }

  async updateClazz(id: string, clazzDto: ClazzDto) {
    const clazz = await this.clazzRepository.findOne({ where: { id } });

    if (!clazz) {
      throw new NotFoundException('Class not found');
    }

    Object.assign(clazz, clazzDto);

    return await this.clazzRepository.save(clazz);
  }

  async deleteClazz(id: string) {
    const clazz = await this.clazzRepository.findOne({ where: { id } });

    if (!clazz) {
      throw new NotFoundException('Class not found');
    }

    return await this.clazzRepository.remove(clazz);
  }
}
