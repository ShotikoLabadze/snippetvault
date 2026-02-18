import { Injectable } from '@nestjs/common';
import { Snippet } from './snippet.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { Model } from 'mongoose';

@Injectable()
export class SnippetsService {
  constructor(
    @InjectModel(Snippet.name) private snippetModel: Model<Snippet>,
  ) {}

  async create(dto: CreateSnippetDto): Promise<Snippet> {
    const create = new this.snippetModel(dto);
    return create.save();
  }

  async findAll(): Promise<Snippet[]> {
    return this.snippetModel.find().sort({ createdAt: -1 }).exec();
  }
}
