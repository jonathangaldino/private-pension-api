import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClaimModule } from './claim/claim.module';
import { CustomerModule } from './customer/customer.module';
import { PlanInvestmentModule } from './plan-investment/plan-investment.module';
import { PlanModule } from './plan/plan.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CustomerModule,
    ProductModule,
    PlanModule,
    PlanInvestmentModule,
    ClaimModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
