import prisma from '@prisma';
import { Prisma } from '@prisma/client';
import { userSelect } from '@prisma/selects';
import { BaseRepository } from '../base.repository';
import { UserEntity } from './user.entity';

export class UserRepository extends BaseRepository<Prisma.UserDelegate> {
  constructor() {
    super(prisma.user, UserEntity);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.findOne<
      Prisma.UserFindFirstArgs['where'],
      Prisma.UserFindFirstArgs['select']
    >(
      {
        email,
      },
      { ...userSelect, FailedLoginAttempt: true },
    );
  }
}
