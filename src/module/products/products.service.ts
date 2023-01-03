import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { StockProductDto } from './dto/stock-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private MIN_STOCK = 0;
  private MAX_STOCK = 1000;

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const productExist = await this.findOne(createProductDto.id);

    if (productExist) {
      throw new BadRequestException(
        `Product with id ${createProductDto.id} exist`,
      );
    }
    return await this.productRepository.save(createProductDto);
  }

  async findAll(deleted = false) {
    return await this.productRepository.find({
      where: { deleted },
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const productExist = await this.findOne(id);

    try {
      if (productExist) {
        await this.productRepository.update(id, updateProductDto);
        return;
      }
    } catch (error) {
      throw new InternalServerErrorException('The product was not updated');
    }

    throw new BadRequestException(`
    Sorry, the product with id ${id} was not updated`);
  }

  async remove(id: number, isDeleted = false) {
    const productExist = await this.findOne(id);

    if (!productExist) {
      throw new NotFoundException(`Product with id ${id} not exist`);
    }

    if (productExist.deleted === isDeleted) {
      throw new NotFoundException(
        `The product with id ${id} is already deleted`,
      );
    }

    try {
      const rows = await this.productRepository.update(
        { id },
        { deleted: isDeleted },
      );

      return rows.affected === 1;
    } catch (error) {
      throw new InternalServerErrorException('The product was not deleted');
    }
  }

  async updateStock(stock: StockProductDto) {
    const product = await this.findOne(stock.id);

    if (!product)
      throw new NotFoundException(
        `the product with id ${stock.id} does not exist`,
      );

    if (product.deleted)
      throw new NotFoundException(`the product with id ${stock.id} is deleted`);

    try {
      const rows = await this.productRepository.update(
        { id: stock.id },
        { stock: stock.stock },
      );

      return rows.affected === 1;
    } catch (error) {
      throw new InternalServerErrorException('The product was not deleted');
    }
  }

  async incrementStock(s: StockProductDto) {
    const product: CreateProductDto = await this.findOne(s.id);

    if (!product) {
      throw new ConflictException('El producto con id ' + s.id + ' no existe');
    }

    if (product.deleted) {
      throw new ConflictException(
        'El producto con id ' + s.id + ' esta borrado',
      );
    }

    let stock = 0;
    if (s.stock + product.stock > this.MAX_STOCK) {
      stock = this.MAX_STOCK;
    } else {
      stock = s.stock + product.stock;
    }

    const rows = await this.productRepository.update({ id: s.id }, { stock });

    return rows.affected == 1;
  }

  async decrementStock(s: StockProductDto) {
    const product: CreateProductDto = await this.findOne(s.id);

    if (!product) {
      throw new ConflictException('El producto con id ' + s.id + ' no existe');
    }

    if (product.deleted) {
      throw new ConflictException(
        'El producto con id ' + s.id + ' esta borrado',
      );
    }

    let stock = 0;
    if (product.stock - s.stock < this.MIN_STOCK) {
      stock = this.MIN_STOCK;
    } else {
      stock = product.stock - s.stock;
    }

    const rows = await this.productRepository.update({ id: s.id }, { stock });

    return rows.affected == 1;
  }
}
