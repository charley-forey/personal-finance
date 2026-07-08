import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database.module';
import { AnalyticsService, PnlService, TaxService } from '../../services/analytics.services';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, PnlService, TaxService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
