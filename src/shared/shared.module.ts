import { Module } from '@nestjs/common';
import { UserRepository } from '../lib/repositories/user';

const PROVIDERS = [UserRepository];

@Module({
  imports: [],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class SharedModule {}
