import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StockProductDto } from './dto/stock-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('/deleted')
  findAllDelete() {
    return this.productsService.findAll(true);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch('/restore/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id, false);
  }

  @Patch('/stock')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateStock(@Body() stock: StockProductDto) {
    return this.productsService.updateStock(stock);
  }

  @Patch('/increment-stock')
  incrementStock(@Body() stock: StockProductDto) {
    return this.productsService.incrementStock(stock);
  }

  @Patch('/decrement-stock')
  decrementStock(@Body() stock: StockProductDto) {
    return this.productsService.decrementStock(stock);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id, true);
  }
}
