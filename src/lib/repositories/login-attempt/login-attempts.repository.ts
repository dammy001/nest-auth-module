import { Prisma } from '@prisma/client';
import { BaseRepository } from '../base.repository';
import { LoginAttemptEntity } from './login-attempt.entity';

export class FailedLoginAttemptRepository extends BaseRepository<Prisma.FailedLoginAttemptDelegate> {
  constructor() {
    super(prisma.failedLoginAttempt, LoginAttemptEntity);
  }

  async syncAttempts(userId: string, attempts: number) {
    const data = {
      attempts,
      userId,
      lastAttemptTime: new Date(),
    };

    return await this.upsert<
      Prisma.FailedLoginAttemptUpsertArgs['where'],
      Partial<Prisma.FailedLoginAttemptCreateInput>,
      Prisma.FailedLoginAttemptUpdateInput
    >({ userId }, { ...data }, data);
  }
}
