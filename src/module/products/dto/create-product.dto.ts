import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import {
  IsOptional,
  IsPositive,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    name: 'id',
    required: false,
    description: 'Id del producto',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  id?: number;

  @ApiProperty({
    name: 'name',
    required: true,
    description: 'Nombre del producto',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    name: 'price',
    required: true,
    description: 'Precio del producto',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price!: number;

  @ApiProperty({
    name: 'stock',
    required: true,
    description: 'Stock del producto',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock!: number;

  @ApiProperty({
    name: 'deleted',
    required: false,
    description: 'Indica si el producto esta borrado',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
