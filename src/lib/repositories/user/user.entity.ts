import { ROLE } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  emailVerified?: Date;

  phoneNo: string;

  verified: string;

  role: ROLE;

  @Exclude({ toPlainOnly: true })
  password?: string;

  createdAt: Date;
}
