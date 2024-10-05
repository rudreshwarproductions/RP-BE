import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  IsUUID,
  IsDate,
} from 'class-validator';

export class Cast {
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
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsUUID()
  castId: string;

  @IsNotEmpty()
  @IsArray()
  images: string[];

  @IsNotEmpty()
  @IsArray()
  actingSkillsVideos: string[];

  @IsOptional()
  @IsArray()
  resume: string[];
}
