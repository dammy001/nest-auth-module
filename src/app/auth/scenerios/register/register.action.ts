import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from '@auth/services/auth.service';
import { RegisterEvent } from '@auth/events/register.event';
import { Request } from 'express';
import { UserEntity, UserRepository } from '@repositories';
import { RegisterCommand } from './register.command';

@Injectable()
export class RegisterAction {
  constructor(
    protected readonly authService: AuthService,
    protected readonly userRepository: UserRepository,
    private readonly dispatcher: EventEmitter2,
  ) {}

  async execute(data: RegisterCommand, request: Request): Promise<any> {
    if (process.env.DISABLE_USER_REGISTRATION === 'true')
      throw new BadRequestException('Account creation is disabled');

    if (await this.userRepository.findByEmail(data.email)) {
      throw new BadRequestException('User already exist');
    }

    const user = await this.createUserAndRegisterDevice(data, request);

    this.dispatcher.emit('auth.registered', new RegisterEvent(user));

    delete user.FailedLoginAttempt;

    return {
      ...user,
      token: await this.authService.getSignedToken(user),
    };
  }

  private async createUserAndRegisterDevice(
    data: RegisterCommand,
    request: Request,
  ): Promise<UserEntity> {
    try {
      return await this.userRepository.createOne({
        ...data,
        password: await bcrypt.hash(data.password, 10),
        Device: {
          create: {
            userAgent: request.headers['user-agent'],
            ip: request.ip,
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unxpected error occurred');
    }
  }
}
