import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database.module';
import { BillingModule } from '../billing/billing.module';
import { PlaidService } from '../../services/core.services';
import { PlaidController } from './plaid.controller';

@Module({
  imports: [DatabaseModule, BillingModule],
  controllers: [PlaidController],
  providers: [PlaidService],
  exports: [PlaidService],
})
export class PlaidModule {}
