import * as z from 'zod';
import { CompleteUser, RelatedUserModel } from './index';

export const FailedLoginAttemptModel = z.object({
  id: z.number().int(),
  userId: z.string(),
  attempts: z.number().int(),
  lastAttemptTime: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export interface CompleteFailedLoginAttempt
  extends z.infer<typeof FailedLoginAttemptModel> {
  user?: CompleteUser;
}

/**
 * RelatedFailedLoginAttemptModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedFailedLoginAttemptModel: z.ZodSchema<CompleteFailedLoginAttempt> =
  z.lazy(() =>
    FailedLoginAttemptModel.extend({
      user: RelatedUserModel,
    }),
  );
