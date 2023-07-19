import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ThrottlerForLoginGuard } from '@shared/framework';
import { LoginBodyDto } from './dtos/login.dto';
import { LoginCommand } from './scenerios/login/login.command';
import { LoginAction } from './scenerios/login/login.action';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
export class AuthController {
  constructor(protected readonly loginAction: LoginAction) {}

  @Post('login')
  @UseGuards(ThrottlerForLoginGuard)
  @Throttle(3, 60)
  @ApiUnauthorizedResponse({ description: 'Invalid login credentials' })
  async login(@Body() data: LoginBodyDto) {
    const payload = await Promise.resolve(
      this.loginAction.execute(
        LoginCommand.create({ email: data.email, password: data.password }),
      ),
    );

    return payload;
  }
}
