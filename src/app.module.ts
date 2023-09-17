import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { PlanModule } from './plan/plan.module';
import { PlanInvestmentModule } from './plan-investment/plan-investment.module';

@Module({
  imports: [ConfigModule.forRoot(), CustomerModule, ProductModule, PlanModule, PlanInvestmentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
