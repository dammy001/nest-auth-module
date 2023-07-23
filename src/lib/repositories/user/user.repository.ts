import prisma from '@prisma-lib';
import { Prisma } from '@prisma/client';
import { userSelect } from '@prisma-lib/selects';
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

  async createOne(data: Prisma.UserCreateInput) {
    return await this.create<Prisma.UserCreateInput>(data, { ...userSelect });
  }
}
