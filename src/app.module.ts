import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './app/auth/auth.module';

const modules: Array<
  Type | DynamicModule | Promise<DynamicModule> | ForwardReference
> = [
  AuthModule,
  ThrottlerModule.forRoot({
    ttl: 60,
    limit: 1500,
  }),
];

@Module({
  imports: modules,
  controllers: [],
  providers: [],
})
export class AppModule {}
