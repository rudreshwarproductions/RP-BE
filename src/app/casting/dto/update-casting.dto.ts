import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCastingDto {
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsOptional()
  @IsString()
  hairColor?: string;

  @IsOptional()
  @IsString()
  eyeColor?: string;

  @IsOptional()
  @IsString()
  languageSpoken?: string;

  @IsOptional()
  @IsString()
  occupationStatus?: string;

  @IsOptional()
  @IsString()
  actingExperience?: string;

  @IsOptional()
  @IsString()
  actingComfortZone?: string;

  @IsOptional()
  @IsString()
  specialSkills?: string;
}
