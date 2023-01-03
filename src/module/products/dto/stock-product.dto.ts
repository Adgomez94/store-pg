import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNotEmpty, IsNumber, IsPositive, Max, Min } from 'class-validator';

export class StockProductDto {
  @ApiProperty({
    name: 'id',
    required: true,
    description: 'Id del producto',
    type: Number,
  })
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  id: number;

  @ApiProperty({
    name: 'stock',
    required: true,
    description: 'Stock del producto',
    type: Number,
  })
  @IsNotEmpty()
  @Min(0)
  @Max(1000)
  stock: number;
}
