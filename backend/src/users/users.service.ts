import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: any): Promise<User> {
    const { email, password, username } = userData;
    const exist = await this.userModel.findOne({ email });

    if (exist) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      email,
      username,
      password: hashed,
    });

    return await newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
