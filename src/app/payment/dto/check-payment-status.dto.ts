import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentStatusDto {
  @IsNotEmpty()
  @IsString()
  transactionId: string;
}
