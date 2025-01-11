import { IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class PaymentInfo {
  @IsNotEmpty()
  @IsNumber()
  amount: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;
}
