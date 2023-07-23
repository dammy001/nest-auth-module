import { BadRequestException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserRepository } from '@repositories';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from '../../services/auth.service';
import { RegisterEvent } from '../../events/register.event';
import { RegisterCommand } from './register.command';

export class RegisterAction {
  constructor(
    protected readonly authService: AuthService,
    protected readonly userRepository: UserRepository,
    private readonly dispatcher: EventEmitter2,
  ) {}

  async execute(data: RegisterCommand): Promise<any> {
    if (process.env.DISABLE_USER_REGISTRATION === 'true')
      throw new BadRequestException('Account creation is disabled');

    if (await this.userRepository.findByEmail(data.email)) {
      throw new BadRequestException('User already exist');
    }

    const user = await this.userRepository.create({
      ...data,
      password: await bcrypt.hash(data.password, 10),
    });

    this.dispatcher.emit('registered', new RegisterEvent(user));

    // send welcome notification
    // send register event

    delete user.FailedLoginAttempt;

    return {
      ...user,
      token: await this.authService.getSignedToken(user),
    };
  }
}
