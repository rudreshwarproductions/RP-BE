import { IsEmail, IsNotEmpty } from 'class-validator';

export class UploadCastingFilesDto {
  @IsNotEmpty()
  @IsEmail()
  email?: string;
}
