import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';

@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}
  @Post()
  create(@Body() createSnippetDto: CreateSnippetDto) {
    const { userId, ...data } = createSnippetDto;
    return this.snippetsService.create(data, userId);
  }

  @Get()
  findAll(@Query('language') language: string, @Query('tag') tag?: string) {
    return this.snippetsService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateSnippetDto: UpdateSnippetDto) {
    return this.snippetsService.update(id, UpdateSnippetDto);
  }

  @Delete()
  remove(@Param('id') id: string) {
    return this.snippetsService.delete(id);
  }
}
