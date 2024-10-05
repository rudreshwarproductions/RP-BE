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
  IsUUID,
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
  @IsPhoneNumber(null)
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

  // Cast fields
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

  @IsNotEmpty()
  @IsArray()
  imageLinks: string[];

  @IsNotEmpty()
  @IsArray()
  videoLink: string[];

  @IsOptional()
  @IsArray()
  resumeLink: string[];

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsBoolean()
  highlight: boolean;

  // Contact fields
  @IsOptional()
  @IsBoolean()
  contacted: boolean;

  @IsOptional()
  @IsString()
  type: string;

  // Other Fields
  @IsOptional()
  @IsNumber()
  order: number;
}
