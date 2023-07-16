import type { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

import { softDeleteMiddleware } from './middleware';

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var prisma: PrismaClient | undefined;
}

const prismaOptions: Prisma.PrismaClientOptions = {};

if (process.env.NODE_ENV !== 'development')
  prismaOptions.log = ['query', 'error', 'warn'];

export const prisma = globalThis.prisma || new PrismaClient(prismaOptions);

export const customPrisma = (options: Prisma.PrismaClientOptions) =>
  new PrismaClient({ ...prismaOptions, ...options });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// If any changed on middleware server restart is required
softDeleteMiddleware(prisma);

export default prisma;
