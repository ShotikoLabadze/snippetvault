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

  async findAll(language?: string, tag?: string): Promise<Snippet[]> {
    const query: any = {};
    if (language) {
      query.language = language;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    return this.snippetModel.find(query).sort({ createdAt: -1 }).exec();
  }
}
