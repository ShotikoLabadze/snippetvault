import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('smart-fill')
  async smartFill(@Body() body: { code: string; language: string }) {
    return this.aiService.generateSmartFill(body.code, body.language);
  }
}
