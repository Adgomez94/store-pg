import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
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
}
