import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginBodyDto } from './dtos/login.dto';
import { LoginCommand } from './scenerios/login/login.command';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
export class AuthController {
  @Post('login')
  @ApiUnauthorizedResponse({ description: 'Invalid login credentials' })
  async login(@Body() data: LoginBodyDto) {
    const payload = await Promise.resolve(
      LoginCommand.create({ email: data.email, password: data.password }),
    );

    return payload;
  }
}
