import { IsNotEmpty, IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateContactDto {
  // User fields
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  // Contact fields
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
