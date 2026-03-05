import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

async register(dto: RegisterDto) {

  if (dto.password !== dto.confirmPassword) {
    throw new BadRequestException('Passwords do not match');
  }

  const existingUser = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (existingUser) {
    throw new BadRequestException('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = await this.prisma.user.create({
    data: {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      provider: 'LOCAL'
    },
  });

  return {
    message: 'User registered successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

 async login(dto: LoginDto) {

  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  if (user.provider === 'GOOGLE') {
    throw new UnauthorizedException(
      'Please login using Google'
    );
  }

  if (!user.password) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(
    dto.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const token = this.jwtService.sign({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    access_token: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

  async googleLogin(userData: any) {

  let user = await this.prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (!user) {
    user = await this.prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        provider: 'GOOGLE',
      },
    });
  }

  const token = this.jwtService.sign({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return {
  access_token: token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    provider: user.provider,
  },
};
}
}