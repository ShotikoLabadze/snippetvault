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
import { BulkDeleteDto } from './dto/bulk-delete.dto';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { SnippetsService } from './snippets.service';

@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Post()
  create(@Body() createSnippetDto: CreateSnippetDto) {
    const { userId, ...data } = createSnippetDto;
    return this.snippetsService.create(data, userId ?? 'guest_id');
  }

  @Get()
  findAll(
    @Query('language') language?: string,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
  ) {
    return this.snippetsService.findAll(language, tag, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.snippetsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateSnippetDto) {
    return this.snippetsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.snippetsService.delete(id);
  }

  @Delete('bulk')
  deleteMany(@Body() bulkDeleteDto: BulkDeleteDto) {
    return this.snippetsService.deleteMany(bulkDeleteDto.ids);
  }
}
