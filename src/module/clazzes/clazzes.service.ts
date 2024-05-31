import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clazz } from 'src/entity/clazz.entity';
import { ILike, Repository } from 'typeorm';
import { ClazzDto } from './dto/clazz.dto';

@Injectable()
export class ClazzesService {
  constructor(
    @InjectRepository(Clazz)
    private readonly clazzRepository: Repository<Clazz>,
  ) {}

  async getClazzes(keyword: string) {
    return await this.clazzRepository.find({
      where: [{ name: ILike(`%${keyword}%`) }],
      relations: ['faculty', 'academicYear'],
      order: { name: 'ASC' },
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
    });
  }

  async createClazz(clazzDto: ClazzDto) {
    try {
      return await this.clazzRepository.save(clazzDto);
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Class already exists');
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
      throw new Error('Class not found');
    }

    Object.assign(clazz, clazzDto);

    return await this.clazzRepository.save(clazz);
  }

  async deleteClazz(id: string) {
    const clazz = await this.clazzRepository.findOne({ where: { id } });

    if (!clazz) {
      throw new Error('Class not found');
    }

    return await this.clazzRepository.remove(clazz);
  }
}
