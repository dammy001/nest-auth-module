import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
// import { Throttle } from '@nestjs/throttler';
import { ThrottlerForLoginGuard } from '@shared/framework';
import { Request } from 'express';
import { LoginBodyDto } from './dtos/login.dto';
import { LoginCommand } from './scenerios/login/login.command';
import { LoginAction } from './scenerios/login/login.action';
import { RegisterBodyDto } from './dtos/register.dto';
import { RegisterAction } from './scenerios/register/register.action';
import { RegisterCommand } from './scenerios/register/register.command';
import { UserEntity } from '@/src/lib';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
export class AuthController {
  constructor(
    protected loginAction: LoginAction,
    protected registerAction: RegisterAction,
  ) {}

  @Post('login')
  @UseGuards(ThrottlerForLoginGuard)
  // @Throttle(3, 60)
  @ApiUnauthorizedResponse({ description: 'Invalid login credentials' })
  @ApiOkResponse({ description: 'Login successfully' })
  async login(@Body() data: LoginBodyDto) {
    const payload = await Promise.resolve(
      this.loginAction.execute(
        LoginCommand.create({ email: data.email, password: data.password }),
      ),
    );

    return payload;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserEntity,
  })
  @ApiUnauthorizedResponse({ description: 'User already exists' })
  async register(@Body() data: RegisterBodyDto, @Req() request: Request) {
    return await this.registerAction.execute(
      RegisterCommand.create({
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phoneNo: data.phone_no,
        password: data.password,
      }),
      request,
    );
  }
}
