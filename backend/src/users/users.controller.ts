import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    const userId = req.user.id;

    return await this.usersService.findOneById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(@Req() req: any, @Body() body: { username: string }) {
    const userId = req.user.id;
    return await this.usersService.update(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(@Req() req: any, @Body() body: any) {
    const userId = req.user.id;
    return await this.usersService.changePassword(userId, body);
  }
}
