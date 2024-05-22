import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Faculty } from 'src/entity/faculty.entity';
import { Repository } from 'typeorm';
import { FacultyDto } from './dto/faculty.dto';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectRepository(Faculty)
    private facultyRepository: Repository<Faculty>,
  ) {}

  async getFaculties() {
    return await this.facultyRepository.find();
  }

  async getFaculty(id: string) {
    return await this.facultyRepository.findOne({ where: { id } });
  }

  async getFacultyByCode(code: string) {
    return await this.facultyRepository.findOne({ where: { code } });
  }

  async getFacultyByName(name: string) {
    return await this.facultyRepository.findOne({ where: { name } });
  }

  async createFaculty(facultyDto: FacultyDto) {
    try {
      return await this.facultyRepository.save(facultyDto);
    } catch (error) {
      if (error.code === '23505') {
        if (error.detail.includes('code')) {
          throw new BadRequestException('Faculty code already exists');
        } else if (error.detail.includes('name')) {
          throw new BadRequestException('Faculty name already exists');
        }
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async createFaculties(facultyDtos: FacultyDto[]) {
    facultyDtos.forEach(async (facultyDto) => {
      await this.createFaculty(facultyDto);
    });
  }

  async updateFaculty(id: string, facultyDto: FacultyDto) {
    const faculty = await this.facultyRepository.findOne({
      where: { id },
    });

    if (!faculty) {
      throw new NotFoundException('Faculty not found');
    }

    Object.assign(faculty, facultyDto);

    return await this.facultyRepository.save(faculty);
  }

  async deleteFaculty(id: string) {
    const faculty = await this.facultyRepository.findOne({
      where: { id },
    });

    if (!faculty) {
      throw new NotFoundException('Faculty not found');
    }

    return await this.facultyRepository.remove(faculty);
  }

  async getFacultyClazzes(id: string) {
    const faculty = await this.facultyRepository.findOne({
      where: { id },
      relations: ['clazzes'],
    });

    if (!faculty) {
      throw new NotFoundException('Faculty not found');
    }

    return faculty.clazzes;
  }

  async getFacultyOrganizer(id: string) {
    const faculty = await this.facultyRepository.findOne({
      where: { id },
      relations: ['organizer'],
    });

    if (!faculty) {
      throw new NotFoundException('Faculty not found');
    }

    return faculty.organizer;
  }
}
