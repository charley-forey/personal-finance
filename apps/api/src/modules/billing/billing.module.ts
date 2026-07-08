import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database.module';
import { BillingService } from '../../services/billing.service';
import { BillingController } from './billing.controller';
import { PlanLimitsGuard } from './plan-limits.guard';

@Module({
  imports: [DatabaseModule],
  controllers: [BillingController],
  providers: [BillingService, PlanLimitsGuard],
  exports: [BillingService, PlanLimitsGuard],
})
export class BillingModule {}
