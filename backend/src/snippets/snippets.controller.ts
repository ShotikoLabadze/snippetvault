import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BulkDeleteDto } from './dto/bulk-delete.dto';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { SnippetsService } from './snippets.service';

@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSnippetDto: CreateSnippetDto, @Req() req: any) {
    return this.snippetsService.create(createSnippetDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('language') language?: string,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
  ) {
    return this.snippetsService.findAll(language, tag, search);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-snippets')
  getMySnippets(@Req() req: any) {
    const userId = req.user.id;

    return this.snippetsService.findMySnippets(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.snippetsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateSnippetDto) {
    return this.snippetsService.update(id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('bulk')
  deleteMany(@Body() bulkDeleteDto: BulkDeleteDto) {
    return this.snippetsService.deleteMany(bulkDeleteDto.ids);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.snippetsService.delete(id);
  }
}
