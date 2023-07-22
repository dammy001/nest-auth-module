import { Module } from '@nestjs/common';
import {
  FailedLoginAttemptRepository,
  UserRepository,
} from '../lib/repositories';

const PROVIDERS = [UserRepository, FailedLoginAttemptRepository];

@Module({
  imports: [],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class SharedModule {}
