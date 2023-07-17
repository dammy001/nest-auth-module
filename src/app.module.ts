import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './app/auth/auth.module';

const modules: Array<
  Type | DynamicModule | Promise<DynamicModule> | ForwardReference
> = [
  AuthModule,
  PassportModule.register({
    defaultStrategy: 'jwt',
  }),
  JwtModule.register({
    secretOrKeyProvider: () => process.env.JWT_SECRET as string,
    signOptions: {
      expiresIn: 360000,
    },
  }),
];

@Module({
  imports: modules,
  controllers: [],
  providers: [],
})
export class AppModule {}
