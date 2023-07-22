export class LoginAttemptEntity {
  id: number;

  userId: string;

  attempts: number;

  lastAttemptTime: Date;

  createdAt: Date;
}
