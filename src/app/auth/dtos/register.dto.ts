import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';

export class RegisterBodyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, {
    message: 'First name must be not be more than 100 characters',
  })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100, {
    message: 'Last name must be not be more than 100 characters',
  })
  last_name: string;

  @IsNumberString()
  @IsNotEmpty()
  phone_no: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  password: string;
}
