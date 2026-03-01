import { Injectable, NotFoundException } from '@nestjs/common';
import { Snippet } from './snippet.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { Model } from 'mongoose';

@Injectable()
export class SnippetsService {
  constructor(
    @InjectModel(Snippet.name) private snippetModel: Model<Snippet>,
  ) {}

  async create(dto: CreateSnippetDto, userId: string): Promise<Snippet> {
    const create = new this.snippetModel({ ...dto, userId: userId });
    return create.save();
  }

  async findAll(
    language?: string,
    tag?: string,
    search?: string,
  ): Promise<Snippet[]> {
    const query: any = {};
    if (language) {
      query.language = language;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (search) {
      query.$text = { $search: search };
    }

    return this.snippetModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async update(
    id: string,
    updateSnippetDto: UpdateSnippetDto,
  ): Promise<Snippet> {
    const existing = await this.snippetModel
      .findByIdAndUpdate(id, updateSnippetDto, { new: true })
      .exec();

    if (!existing) {
      throw new NotFoundException(`Snippet with ID ${id} not found`);
    }

    return existing;
  }

  async delete(id: string) {
    const result = await this.snippetModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Snippet with ID ${id} not found`);
    }

    return { deleted: true };
  }
}
