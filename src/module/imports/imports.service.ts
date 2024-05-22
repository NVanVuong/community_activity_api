import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcademicYear } from 'src/entity/academic-year.entity';
import { Clazz } from 'src/entity/clazz.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { Repository } from 'typeorm';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { User } from 'src/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { DEFAULT_PASSWORD } from 'src/common/constants';

@Injectable()
export class ImportsService {
  constructor(
    @InjectRepository(Faculty)
    private facultyRepository: Repository<Faculty>,
    @InjectRepository(AcademicYear)
    private academicYearRepository: Repository<AcademicYear>,
    @InjectRepository(Clazz)
    private clazzRepository: Repository<Clazz>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async readCSV(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(
          csv({
            mapHeaders: ({ header }) => header.trim(),
          }),
        )
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  async createLookupMapsForClass() {
    const faculties = await this.facultyRepository.find();
    const academicYears = await this.academicYearRepository.find();

    const facultyMap = new Map();
    const academicYearMap = new Map();

    faculties.forEach((faculty) => {
      facultyMap.set(faculty.name, faculty.id);
    });

    academicYears.forEach((year) => {
      academicYearMap.set(year.code, year.id);
    });

    return { facultyMap, academicYearMap };
  }

  async createClasses(data, facultyMap, academicYearMap) {
    const classes = data
      .map((row) => {
        const clazz = new Clazz();
        clazz.name = row.name;

        const facultyId = facultyMap.get(row.faculty);
        const academicYearId = academicYearMap.get(row.academic_year);

        if (!facultyId || !academicYearId) {
          console.error('Error mapping for row:', row);
          return null;
        }

        const faculty = new Faculty();
        faculty.id = facultyId;

        const academicYear = new AcademicYear();
        academicYear.id = academicYearId;

        clazz.faculty = faculty;
        clazz.academicYear = academicYear;

        if (!clazz.name || !clazz.faculty.id || !clazz.academicYear.id) {
          console.error('Invalid class object:', clazz);
          return null;
        }

        return clazz;
      })
      .filter((c) => c !== null);

    if (classes.length > 0) {
      await this.clazzRepository.save(classes);
    } else {
      console.error('No valid classes to save');
    }

    return classes.length;
  }

  async importClazzes(filePath: string) {
    const data = await this.readCSV(filePath);
    const { facultyMap, academicYearMap } =
      await this.createLookupMapsForClass();
    return await this.createClasses(data, facultyMap, academicYearMap);
  }

  async createLookupMapsForUser() {
    const classes = await this.clazzRepository.find();
    const clazzMap = new Map();

    classes.forEach((clazz) => {
      clazzMap.set(clazz.name, clazz.id);
    });

    return { clazzMap };
  }

  async createUsers(data, clazzMap) {
    const hashPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const batchSize = 1000;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      const users = batch
        .map((row) => {
          const user = new User();
          const clazz = new Clazz();

          user.id = row.studentId;
          user.studentId = row.studentId;
          user.username = row.studentId;
          user.password = hashPassword;
          user.name = row.name;
          user.score = row.score ? parseInt(row.score) : 0;

          clazz.id = clazzMap.get(row.class);
          user.clazz = clazz;

          return user;
        })
        .filter((user) => user !== null);

      await this.userRepository.save(users);
    }

    return data.length;
  }

  async importUsers(filePath: string) {
    const data = await this.readCSV(filePath);
    const { clazzMap } = await this.createLookupMapsForUser();
    return await this.createUsers(data, clazzMap);
  }
}
