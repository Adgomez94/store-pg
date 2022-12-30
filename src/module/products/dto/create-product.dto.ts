import {
  IsOptional,
  IsPositive,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price!: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock!: number;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
