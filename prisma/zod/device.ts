import * as z from 'zod';
import { CompleteUser, RelatedUserModel } from './index';

export const DeviceModel = z.object({
  id: z.number().int(),
  userId: z.string(),
  userAgent: z.string(),
  ip: z.string().nullish(),
  deviceName: z.string().nullish(),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export interface CompleteDevice extends z.infer<typeof DeviceModel> {
  user?: CompleteUser;
}

/**
 * RelatedDeviceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedDeviceModel: z.ZodSchema<CompleteDevice> = z.lazy(() =>
  DeviceModel.extend({
    user: RelatedUserModel,
  }),
);
