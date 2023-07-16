import { Prisma } from '@prisma/client';

export const userSelect = Prisma.validator<Prisma.UserSelect>()({
  email: true,
  firstName: true,
  lastName: true,
  phoneNo: true,
  emailVerified: true,
  verified: true,
  createdAt: true,
});
