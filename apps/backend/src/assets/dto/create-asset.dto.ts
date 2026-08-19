import {
  IsArray,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';

import { AssetType } from '../asset.entity';

export class CreateAssetDto {
  @IsString()
  @IsOptional()
  artist?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genre?: string[];

  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  style?: string[];

  @IsEnum(AssetType)
  type?: AssetType;

  @IsString()
  @IsOptional()
  fileKey?: string;
}
