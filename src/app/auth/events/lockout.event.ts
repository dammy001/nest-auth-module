import { LoginCommand } from '../scenerios/login/login.command';
import { UserEntity } from '@/src/lib';

export class LockoutEvent {
  constructor(
    protected readonly user: UserEntity,
    protected readonly request: LoginCommand,
  ) {}
}
