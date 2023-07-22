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
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100, {
    message: 'Last name must be not be more than 100 characters',
  })
  lastName: string;

  @IsNumberString()
  @IsNotEmpty()
  phoneNo: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  password: string;
}
