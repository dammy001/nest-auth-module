import { createHmac } from 'node:crypto';
import { Logger } from '@nestjs/common';

export function createHash(key: string, valueToHash: string) {
  Logger.verbose('Creating Hmac');

  return createHmac('sha256', key).update(valueToHash).digest('hex');
}
