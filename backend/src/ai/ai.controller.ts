import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Post('smart-fill')
  async smartFill(@Body() body: { code: string; language: string }) {
    return this.aiService.generateSmartFill(body.code, body.language);
  }
}
