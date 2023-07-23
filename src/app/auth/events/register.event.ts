import { UserEntity } from '@repositories';

export class RegisterEvent {
  constructor(public readonly user: UserEntity) {}
}
