import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [ConfigModule.forRoot(), CustomerModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
