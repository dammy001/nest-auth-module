import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import prisma from '@prisma';
import { userSelect } from '@prisma/selects';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // eslint-disable-next-line require-await
  async getSignedToken(user: User): Promise<string> {
    return this.jwtService.sign(
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
