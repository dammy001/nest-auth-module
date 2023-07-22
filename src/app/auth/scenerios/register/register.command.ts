import {
  IsAlphanumeric,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';
import { BaseCommand } from '@shared/commands';

export class RegisterCommand extends BaseCommand {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, {
    message: 'firstName must be not be more than 100 characters',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100, {
    message: 'Last name must be not be more than 100 characters',
  })
  lastName: string;

  @IsNumberString()
  @IsNotEmpty()
  @IsDefined()
  phoneNo: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsAlphanumeric()
  password: string;
}
