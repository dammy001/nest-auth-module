import { ROLE } from '@prisma/client';
import * as dayjs from 'dayjs';
import { hashPassword } from '../src/lib/hash-password';
import prisma from '.';

async function createUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  role?: ROLE;
  password?: string;
}) {
  const userData = {
    ...data,
    emailVerified: dayjs().toDate(),
    verified: true,
    password: await hashPassword(data?.password ?? 'password'),
  };

  const user = await prisma.user.upsert({
    where: { email: userData.email },
    create: userData,
    update: userData,
  });

  console.log(
    `👤 Upserted successfully with email "${data.email}" & password "${userData.password}".`,
  );

  return user;
}

async function main() {
  await Promise.all([
    createUser({
      firstName: 'Damilare',
      lastName: 'Anjorin',
      email: 'damilareanjorin1@gmail.com',
      phoneNo: '+2348100000000',
    }),
    createUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      phoneNo: '+234811000000',
    }),
  ]);
}

main()
  .then(() => {})
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
