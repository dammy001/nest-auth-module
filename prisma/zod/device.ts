import * as z from 'zod';
import { CompleteUser, UserModel } from './index';

export const _DeviceModel = z.object({
  id: z.number().int(),
  userId: z.string(),
  userAgent: z.string(),
  ip: z.string().nullish(),
  deviceName: z.string().nullish(),
  active: z.boolean().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export interface CompleteDevice extends z.infer<typeof _DeviceModel> {
  user: CompleteUser;
}

/**
 * DeviceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const DeviceModel: z.ZodSchema<CompleteDevice> = z.lazy(() =>
  _DeviceModel.extend({
    user: UserModel,
  }),
);
