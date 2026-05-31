import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userData: any): Promise<User> {
    const { email, password, username } = userData;

    const exist = await this.prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashed,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  }

  async findOneById(id: string): Promise<Partial<User> | null> {
    return this.prisma.user.findUnique({
      where: { id },

      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
