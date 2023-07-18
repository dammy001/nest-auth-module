import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { AuthModule } from './app/auth/auth.module';

const modules: Array<
  Type | DynamicModule | Promise<DynamicModule> | ForwardReference
> = [AuthModule];

@Module({
  imports: modules,
  controllers: [],
  providers: [],
})
export class AppModule {}
