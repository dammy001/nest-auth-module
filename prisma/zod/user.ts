import * as z from 'zod';
import { ROLE } from '@prisma/client';
import {
  CompleteDevice,
  CompleteFailedLoginAttempt,
  RelatedDeviceModel,
  RelatedFailedLoginAttemptModel,
} from './index';

export const UserModel = z.object({
  id: z.string(),
  firstName: z
    .string()
    .max(100, { message: 'first name must be shorter than 100 characters' }),
  lastName: z
    .string()
    .max(100, { message: 'last name must be shorter than 100 characters' }),
  email: z
    .string()
    .max(150, { message: 'email must be shorter than 100 characters' }),
  emailVerified: z.date().nullish(),
  phoneNo: z.string(),
  role: z.nativeEnum(ROLE),
  verified: z.boolean(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
});

export interface CompleteUser extends z.infer<typeof UserModel> {
  Device?: CompleteDevice[];
  FailedLoginAttempt?: CompleteFailedLoginAttempt[];
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() =>
  UserModel.extend({
    Device: RelatedDeviceModel.array(),
    FailedLoginAttempt: RelatedFailedLoginAttemptModel.array(),
  }),
);
