import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class CreateCastingDto {
  // User fields
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  gender: string;

  // Casting fields
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsOptional()
  @IsString()
  hairColor: string;

  @IsOptional()
  @IsString()
  eyeColor: string;

  @IsNotEmpty()
  @IsString()
  languageSpoken: string;

  @IsOptional()
  @IsString()
  occupationStatus: string;

  @IsNotEmpty()
  @IsString()
  actingExperience: string;

  @IsNotEmpty()
  @IsString()
  actingComfortZone: string;

  @IsOptional()
  @IsString()
  specialSkills: string;
}
