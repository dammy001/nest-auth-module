import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserEntity, UserRepository } from '@repositories/user';
import dayjs from 'dayjs';
import { AuthService } from '../../services/auth.service';
import { LoginCommand } from './login.command';

@Injectable()
export class LoginAction {
  public MAX_LOGIN_TRIES: number = 6;
  public BLOCKED_FOR: number = 3;

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
      const failedAttempts = await this.updateFailedAttempts(user);
      const remainingAttempts = this.MAX_LOGIN_TRIES - failedAttempts;

      if (remainingAttempts === 0 && user.failedLoginAttempt) {
        const blockedMinutesLeft = this.getBlockedMinutesLeft(
          user.failedLoginAttempt.lastAttemptTime,
        );

        throw new UnauthorizedException(
          `Your Account has been blocked, Please try again after ${blockedMinutesLeft} minutes`,
        );
      }

      if (remainingAttempts < 3) {
        throw new UnauthorizedException(
          `Invalid login credentials. ${remainingAttempts} Attempts left`,
        );
      }

      throw new UnauthorizedException(`Invalid login credentials`);
    }

    return user;
  }

  private async updateFailedAttempts(user: UserEntity) {
    let attempts = user?.failedLoginAttempt?.attempts ?? 1;
    const lastFailedAttemptTime = user?.failedLoginAttempt?.lastAttemptTime;

    if (lastFailedAttemptTime) {
      const diff = this.getTimeDiffForAttempt(lastFailedAttemptTime);
      attempts = diff < this.BLOCKED_FOR ? attempts + 1 : 1;
    }

    await this.userRepository.update(
      { id: user.id },
      {
        FailedLoginAttempt: {
          delete: {
            userId: user.id,
          },
        },
      },
    );

    await this.userRepository.update(
      { id: user.id },
      {
        FailedLoginAttempt: {
          connectOrCreate: {
            where: { userId: user.id },
            create: {
              attempts,
              lastAttemptTime: new Date(),
            },
          },
        },
      },
    );

    return attempts;
  }

  private getTimeDiffForAttempt(lastAttemptTime: Date | string): number {
    return dayjs(new Date()).diff(dayjs(lastAttemptTime));
  }

  private getBlockedMinutesLeft(lastFailedTime: string | Date): number {
    const diff = this.getTimeDiffForAttempt(lastFailedTime);

    return this.BLOCKED_FOR - diff;
  }
}
