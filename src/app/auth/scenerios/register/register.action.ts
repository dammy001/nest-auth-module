import { BadRequestException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserRepository } from '@repositories';
import { AuthService } from '../../services/auth.service';
import { RegisterCommand } from './register.command';

export class RegisterAction {
  constructor(
    protected readonly authService: AuthService,
    protected readonly userRepository: UserRepository,
  ) {}

  async execute(data: RegisterCommand): Promise<any> {
    if (process.env.DISABLE_USER_REGISTRATION === 'true')
      throw new BadRequestException('Account creation is disabled');

    console.log(data);
    const exists = await this.userRepository.findByEmail(data.email);

    if (exists) {
      throw new BadRequestException('User already exist');
    }

    const user = await this.userRepository.create({
      ...data,
      password: await bcrypt.hash(data.password, 10),
    });

    // send welcome notification

    delete user.FailedLoginAttempt;

    return {
      ...user,
      token: await this.authService.getSignedToken(user),
    };
  }
}
