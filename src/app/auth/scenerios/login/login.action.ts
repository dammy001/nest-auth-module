import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from '@auth/services/auth.service';
import { LockoutEvent } from '@auth/events/lockout.event';
import { LoginCommand } from './login.command';
import {
  FailedLoginAttemptRepository,
  UserEntity,
  UserRepository,
} from '@/src/lib/repositories';

@Injectable()
export class LoginAction {
  private readonly MAX_LOGIN_ATTEMPTS: number = 6;
  private readonly BLOCKED_FOR: number = 3;

  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly failedLoginRepository: FailedLoginAttemptRepository,
    private readonly dispatcher: EventEmitter2,
  ) {}

  async execute(data: LoginCommand): Promise<{
    user: UserEntity;
    token: string;
  }> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    this.hasTooManyLoginAttempts(user, () => this.sendLockoutResponse(user));

    if (!this.attemptLogin(user, data)) {
      this.fireLockoutEvent(user, data);

      this.sendFailedLoginResponse(
        user,
        await this.incrementLoginAttempts(user),
      );
    }

    this.clearLoginAttempts(user);

    delete user.FailedLoginAttempt;

    return { user, token: await this.authService.getSignedToken(user) };
  }

  protected fireLockoutEvent(user: UserEntity, request: LoginCommand): void {
    this.dispatcher.emit('auth.lockout', new LockoutEvent(user, request));
  }

  private async attemptLogin(
    user: UserEntity,
    request: LoginCommand,
  ): Promise<any> {
    return await bcrypt.compare(request.password, user.password);
  }

  private sendFailedLoginResponse(
    user: UserEntity,
    failedAttempts: number,
  ): void | never {
    const remainingAttempts = this.maxAttempts() - failedAttempts;

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

  private sendLockoutResponse(user: UserEntity): never {
    const blockedMinutesLeft = this.getBlockedMinutesLeft(
      user.FailedLoginAttempt.lastAttemptTime,
    );

    throw new UnauthorizedException(
      `Your account has been blocked, Please try again after ${blockedMinutesLeft} minutes`,
    );
  }

  private async clearLoginAttempts(user: UserEntity): Promise<any> {
    if (user?.FailedLoginAttempt && user?.FailedLoginAttempt?.attempts > 0) {
      return await this.failedLoginRepository.update(
        { userId: user.id },
        { attempts: 0 },
      );
    }
  }

  private async incrementLoginAttempts(user: UserEntity) {
    let attempts = user?.FailedLoginAttempt?.attempts ?? 1;
    const lastFailedAttemptTime = user?.FailedLoginAttempt?.lastAttemptTime;

    if (lastFailedAttemptTime) {
      const diff = this.getTimeDiffForAttempt(lastFailedAttemptTime);
      attempts = diff < this.decayMinutes() ? attempts + 1 : 1;
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

    return this.decayMinutes() - diff;
  }

  private hasTooManyLoginAttempts(user: UserEntity, callback?: () => void) {
    const lastFailedAttempt = user?.FailedLoginAttempt?.lastAttemptTime;
    if (!lastFailedAttempt) return false;

    const diff = this.getTimeDiffForAttempt(lastFailedAttempt);

    const isBlocked =
      user?.FailedLoginAttempt &&
      user?.FailedLoginAttempt?.attempts >= this.maxAttempts() &&
      diff < this.decayMinutes();

    if (isBlocked && typeof callback === 'function') {
      return callback();
    }

    return isBlocked;
  }

  public maxAttempts(): number {
    return this.MAX_LOGIN_ATTEMPTS;
  }

  public decayMinutes(): number {
    return this.BLOCKED_FOR;
  }

  private throttleKey(data: LoginCommand) {
    return `${data.email.toLowerCase()}`;
  }
}
