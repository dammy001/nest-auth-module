import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { AuthService } from '../../services/auth.service';
import { LoginCommand } from './login.command';
import {
  FailedLoginAttemptRepository,
  UserEntity,
  UserRepository,
} from '@/src/lib/repositories';

@Injectable()
export class LoginAction {
  public readonly MAX_LOGIN_TRIES: number = 6;
  public readonly BLOCKED_FOR: number = 3;

  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly failedLoginRepository: FailedLoginAttemptRepository,
  ) {}

  async execute(data: LoginCommand) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    this.whenAccountHasBeenBlocked(user, () => this.lockAccount(user));

    if (!(await bcrypt.compare(data.password, user.password))) {
      const failedAttempts = await this.updateFailedAttempts(user);
      const remainingAttempts = this.MAX_LOGIN_TRIES - failedAttempts;

      if (remainingAttempts === 0 && user.FailedLoginAttempt) {
        const blockedMinutesLeft = this.getBlockedMinutesLeft(
          user.FailedLoginAttempt?.lastAttemptTime,
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

    if (user?.FailedLoginAttempt && user?.FailedLoginAttempt?.attempts > 0) {
      this.resetFailedLoginAttempts(user);
    }

    delete user.FailedLoginAttempt;

    return { user, token: await this.authService.getSignedToken(user) };
  }

  private lockAccount(user: UserEntity): never {
    const blockedMinutesLeft = this.getBlockedMinutesLeft(
      user.FailedLoginAttempt.lastAttemptTime,
    );

    throw new UnauthorizedException(
      `Your account has been blocked, Please try again after ${blockedMinutesLeft} minutes`,
    );
  }

  private async resetFailedLoginAttempts(user: UserEntity): Promise<any> {
    return await this.failedLoginRepository.update(
      { userId: user.id },
      { attempts: 0 },
    );
  }

  private async updateFailedAttempts(user: UserEntity) {
    let attempts = user?.FailedLoginAttempt?.attempts ?? 1;
    const lastFailedAttemptTime = user?.FailedLoginAttempt?.lastAttemptTime;

    if (lastFailedAttemptTime) {
      const diff = this.getTimeDiffForAttempt(lastFailedAttemptTime);
      attempts = diff < this.BLOCKED_FOR ? attempts + 1 : 1;
    }

    // move this from db to redis
    await this.failedLoginRepository.syncAttempts(user.id, attempts);

    return attempts;
  }

  private getTimeDiffForAttempt(lastAttemptTime: Date | string): number {
    return dayjs(new Date()).diff(dayjs(lastAttemptTime), 'minutes');
  }

  private getBlockedMinutesLeft(lastFailedTime: string | Date): number {
    const diff = this.getTimeDiffForAttempt(lastFailedTime);

    return this.BLOCKED_FOR - diff;
  }

  private whenAccountHasBeenBlocked(user: UserEntity, callback?: () => void) {
    const lastFailedAttempt = user?.FailedLoginAttempt?.lastAttemptTime;
    if (!lastFailedAttempt) return false;

    const diff = this.getTimeDiffForAttempt(lastFailedAttempt);

    const isBlocked =
      user?.FailedLoginAttempt &&
      user?.FailedLoginAttempt?.attempts >= this.MAX_LOGIN_TRIES &&
      diff < this.BLOCKED_FOR;

    if (isBlocked && typeof callback === 'function') {
      return callback();
    }

    return isBlocked;
  }
}
