import * as z from 'zod';
import { ROLE } from '@prisma/client';
import { CompleteDevice, DeviceModel } from './index';

export const _UserModel = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  emailVerified: z.date().nullish(),
  phoneNo: z.string(),
  role: z.nativeEnum(ROLE),
  verified: z.boolean().nullish(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
});

export interface CompleteUser extends z.infer<typeof _UserModel> {
  Device: CompleteDevice[];
}

/**
 * UserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const UserModel: z.ZodSchema<CompleteUser> = z.lazy(() =>
  _UserModel.extend({
    Device: DeviceModel.array(),
  }),
);
