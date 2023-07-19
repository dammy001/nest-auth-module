import { UnauthorizedException, createParamDecorator } from '@nestjs/common';
import jwt from 'jsonwebtoken';

export const User = createParamDecorator((data, ctx) => {
  const req = ctx.switchToHttp().getRequest();

  if (req.user) {
    req.user.firstName = (req.user.firstName || '').trim();
    req.user.lastName = (req.user.lastName || '').trim();

    return req.user;
  }

  if (req.headers && req.headers.authorization) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer')
      throw new UnauthorizedException('Authorization type must be "Bearer"');

    if (!token) throw new UnauthorizedException('Invalid token provided');

    const user = jwt.decode(token);

    return user;
  }

  return null;
});
