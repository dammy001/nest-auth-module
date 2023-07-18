import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../../shared/framework/auth.guard';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './services/passport/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secretOrKeyProvider: () => process.env.JWT_SECRET as string,
      signOptions: {
        expiresIn: 360000,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtAuthGuard, JwtStrategy, AuthService],
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}
