import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserRepository } from '@repositories/user';
import { AuthService } from '../../services/auth.service';
import { LoginCommand } from './login.command';

@Injectable()
export class LoginAction {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(data: LoginCommand) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    return user;
  }
}
