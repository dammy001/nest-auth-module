import { Prisma } from '@prisma/client';

export const userSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phoneNo: true,
  emailVerified: true,
  verified: true,
  password: true,
  createdAt: true,
});
