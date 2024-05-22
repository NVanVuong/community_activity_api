import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClazzesService } from '../clazzes/clazzes.service';
import { plainToInstance } from 'class-transformer';
import { UserStudentDto } from './dto/user.dto';
import { DEFAULT_PASSWORD } from 'src/common/constants';
import { FacultiesService } from '../faculties/faculties.service';
import { RoleEnum } from '../roles/dto/roles.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private clazzesService: ClazzesService,
    private facultiesService: FacultiesService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { studentId, clazzId, facultyId, role } = createUserDto;

      const user = new User();
      user.id = uuidv4();

      switch (role) {
        case RoleEnum.USER:
          if (!clazzId || !studentId) {
            throw new BadRequestException('ClassID and StudentID are required');
          }
          const clazzForUser = await this.clazzesService.getClazz(clazzId);
          user.username = studentId;
          user.clazz = clazzForUser;
          user.id = studentId;
          break;

        case RoleEnum.CLASS:
          if (!clazzId) throw new BadRequestException('ClassID is required');

          const clazzForClass = await this.clazzesService.getClazz(clazzId);
          user.username = clazzForClass.name.toLowerCase();
          user.name = clazzForClass.name;
          user.clazz = clazzForClass;
          user.id = clazzForClass.id;
          break;

        case RoleEnum.FACULTY:
          if (!facultyId)
            throw new BadRequestException('FacultyID is required');

          const faculty = await this.facultiesService.getFaculty(facultyId);
          user.username = faculty.code.toLowerCase();
          user.name = faculty.name;
          user.faculty = faculty;
          user.id = faculty.id;
          break;

        default:
          break;
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);
      user.password = hashPassword;
      user.role = role;

      Object.assign(user, createUserDto);

      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleUserCreationError(error);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleUserCreationError(error);
    }
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.remove(user);
  }

  async getUser(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async getUsersByClazz(clazzId: string, user: User) {
    if (clazzId !== user.clazz.id) {
      throw new BadRequestException(
        'You are not authorized to view this class',
      );
    }

    const users = await this.usersRepository.find({
      where: {
        clazz: {
          id: clazzId,
        },
        role: RoleEnum.USER,
      },
    });

    return users.map((user) => plainToInstance(UserStudentDto, user));
  }

  private handleUserCreationError(error: any) {
    if (error.code === '23505') {
      if (error.detail.includes('username')) {
        throw new BadRequestException('Username already exists');
      } else if (error.detail.includes('email')) {
        throw new BadRequestException('Email already exists');
      } else if (error.detail.includes('phoneNumber')) {
        throw new BadRequestException('Phone number already exists');
      } else if (error.detail.includes('studentId')) {
        throw new BadRequestException('Student ID already exists');
      }
    } else {
      throw new BadRequestException();
    }
  }
}
