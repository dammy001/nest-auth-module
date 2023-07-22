import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import prisma from '@prisma-lib';
import { userSelect } from '@/src/lib/prisma/selects';
import { UserEntity } from '@/src/lib';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // eslint-disable-next-line require-await
  async getSignedToken(user: User | UserEntity): Promise<string> {
    return await this.jwtService.signAsync(
      { ...user },
      {
        expiresIn: '30 days',
        issuer: 'auth_service',
      },
    );
  }

  async validateUser(payload: Partial<User>) {
    const user = await prisma.user.findFirst({
      where: { id: payload.id },
      select: userSelect,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async decodeJwt<T>(token: string): Promise<T> {
    return (await this.jwtService.decode(token)) as T;
  }

  verifyJwt(jwt: string) {
    return this.jwtService.verify(jwt);
  }
}
