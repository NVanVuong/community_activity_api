import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload';
import { User } from 'src/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;

    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Username does not exist');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Please check your login credentials');
    }

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      role: user.role.name,
    };

    return { accessToken: await this.jwtService.sign(payload) };
  }

  async generateAccessToken(user: User) {
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      role: user.role.name,
    };

    return await this.jwtService.sign(payload);
  }
}
