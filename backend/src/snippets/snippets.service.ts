import { Injectable, NotFoundException } from '@nestjs/common';
import { Snippet } from '@prisma/client';

import { PrismaService } from '../../prisma.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';

@Injectable()
export class SnippetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSnippetDto, userId: string): Promise<Snippet> {
    return this.prisma.snippet.create({
      data: {
        title: dto.title,
        code: dto.code,
        language: dto.language,
        tags: dto.tags || [],
        isPublic: dto.isPublic ?? true,
        imageUrl: dto.imageUrl,
        userId: userId,
      },
    });
  }

  async findAll(
    language?: string,
    tag?: string,
    search?: string,
  ): Promise<Snippet[]> {
    const whereClause: any = {};

    if (language) {
      whereClause.language = language;
    }

    if (tag) {
      whereClause.tags = { has: tag };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.snippet.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Snippet> {
    const snippet = await this.prisma.snippet.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!snippet) {
      throw new NotFoundException(`Snippet with ID ${id} not found`);
    }

    return snippet;
  }

  async update(
    id: string,
    updateSnippetDto: UpdateSnippetDto,
  ): Promise<Snippet> {
    const existingSnippet = await this.prisma.snippet.findUnique({
      where: { id },
    });

    if (!existingSnippet) {
      throw new NotFoundException(`Snippet with ID ${id} not found`);
    }

    return this.prisma.snippet.update({
      where: { id },
      data: {
        title: updateSnippetDto.title ?? undefined,
        code: updateSnippetDto.code ?? undefined,
        language: updateSnippetDto.language ?? undefined,

        imageUrl: updateSnippetDto.imageUrl ?? undefined,
        tags: updateSnippetDto.tags ? updateSnippetDto.tags || [] : undefined,
      },
    });
  }

  async delete(id: string) {
    try {
      await this.prisma.snippet.delete({
        where: { id },
      });
      return { deleted: true };
    } catch (error) {
      throw new NotFoundException(`Snippet with ID ${id} not found`);
    }
  }

  async deleteMany(ids: string[]) {
    const result = await this.prisma.snippet.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return { deletedCount: result.count };
  }

  async findMySnippets(userId: string): Promise<Snippet[]> {
    return this.prisma.snippet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
