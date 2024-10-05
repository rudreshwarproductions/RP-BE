import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class Contact {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsBoolean()
  contacted: boolean;

  @IsOptional()
  @IsUUID()
  contactId: string;
}
