import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { BillingModule } from '../billing/billing.module';
import { KnowledgeService } from '../../services/platform.services';
import { AiController } from './ai.controller';

@Module({
  imports: [DatabaseModule, AnalyticsModule, BillingModule],
  controllers: [AiController],
  providers: [KnowledgeService],
})
export class AiModule {}
