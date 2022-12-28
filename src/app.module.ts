import { Module } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './module/products/products.module';

const typeOrmConfig = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'root',
  password: 'root',
  database: 'store-postgress',
  entities: [`${__dirname}/**/entities/**/*{.js,.ts}`],
  synchronize: true,
  subscribers: [],
  logging: true,
} as TypeOrmModuleOptions;

@Module({
  imports: [TypeOrmModule.forRoot({ ...typeOrmConfig }), ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
