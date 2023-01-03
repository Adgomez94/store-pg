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
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger/dist';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StockProductDto } from './dto/stock-product.dto';
import { ApiTags } from '@nestjs/swagger/dist/decorators';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({
    description: 'Crear un producto',
  })
  @ApiBody({
    description: 'Crear un producto mediante un ProductDTO',
    type: CreateProductDto,
    examples: {
      ejemplo1: {
        value: {
          id: 3,
          name: 'Producto 3',
          price: 50,
          stock: 50,
        },
      },
    },
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    description: 'Obtiene todos los productos no borrados',
  })
  findAll() {
    return this.productsService.findAll();
  }

  @Get('/deleted')
  @ApiOperation({
    description: 'Obtiene todos los productos borrados',
  })
  findAllDelete() {
    return this.productsService.findAll(true);
  }

  @Get(':id')
  @ApiOperation({
    description: 'Obtiene un producto mediante su id',
  })
  @ApiParam({
    name: 'id',
    description: 'id del producto',
    required: true,
    type: Number,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    description: 'Actualiza un producto, sino existe, se crea.',
  })
  @ApiBody({
    description:
      'Actualiza un producto mediante un ProductDto, sino existe, se crea.',
    type: UpdateProductDto,
    examples: {
      ejemplo1: {
        value: {
          id: 7,
          name: 'Producto 10',
          price: 500,
          stock: 30,
        },
      },
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch('/restore/:id')
  @ApiOperation({
    description: 'Borra un producto (borrado suave).',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id del producto',
    type: Number,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id, false);
  }

  @Patch('/stock')
  @ApiOperation({
    description: 'Actualiza el stock de un producto.',
  })
  @ApiBody({
    description: 'Actualiza el stock de un producto mediante un StockDto.',
    type: StockProductDto,
    examples: {
      ejemplo1: {
        value: {
          id: 1,
          stock: 100,
        },
      },
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  updateStock(@Body() stock: StockProductDto) {
    return this.productsService.updateStock(stock);
  }

  @Patch('/increment-stock')
  @ApiOperation({
    description: 'Incrementa el stock de un producto.',
  })
  @ApiBody({
    description:
      'Incrementa el stock de un producto mediante un StockDto, en el caso de superar 1000 de stock, este lo limita a 1000.',
    type: StockProductDto,
    examples: {
      ejemplo1: {
        value: {
          id: 1,
          stock: 100,
        },
      },
      ejemplo2: {
        value: {
          id: 1,
          stock: 1000,
        },
      },
    },
  })
  incrementStock(@Body() stock: StockProductDto) {
    return this.productsService.incrementStock(stock);
  }

  @Patch('/decrement-stock')
  @ApiOperation({
    description: 'Decrementa el stock de un producto.',
  })
  @ApiBody({
    description:
      'Decrementa el stock de un producto mediante un StockDto, en el caso de que sea inferior a 0, este lo limita a 0.',
    type: StockProductDto,
    examples: {
      ejemplo1: {
        value: {
          id: 1,
          stock: 100,
        },
      },
      ejemplo2: {
        value: {
          id: 1,
          stock: 1000,
        },
      },
    },
  })
  decrementStock(@Body() stock: StockProductDto) {
    return this.productsService.decrementStock(stock);
  }

  @Delete(':id')
  @ApiOperation({
    description: 'Borra un producto (borrado suave).',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id, true);
  }
}
