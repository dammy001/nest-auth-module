import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlerForLoginGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    return req.body.email ?? req.ips.length ? req.ips[0] : req.ip;
  }
}
