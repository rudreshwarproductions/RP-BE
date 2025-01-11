import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsDate,
  IsUUID,
} from 'class-validator';

export class User {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber(null)
  phone: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsDate()
  dateOfBirth: Date;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
