import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../../shared/framework/auth.guard';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './services/passport/jwt.strategy';
import { AuthController } from './auth.controller';
import { SCENERIOS } from './scenerios';
import { SharedModule } from '@/src/shared/shared.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secretOrKeyProvider: () => process.env.JWT_SECRET ?? 'secret',
      signOptions: {
        expiresIn: 360000,
      },
    }),
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [JwtAuthGuard, JwtStrategy, AuthService, ...SCENERIOS],
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}
