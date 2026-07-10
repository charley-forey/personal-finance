import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { PlaidModule } from '../plaid/plaid.module';
import { BillingModule } from '../billing/billing.module';
import { CategoryService } from '../../services/category.service';
import {
  NotificationService,
  FeatureFlagService,
  AdminService,
  IntegrationService,
  ReportService,
  VerificationService,
  AdvisorService,
  HouseholdService,
  ComplianceService,
} from '../../services/platform.services';
import { PlatformAdminGuard } from '../../common/platform-admin.guard';
import { PlatformController } from './platform.controller';
import { StorageService } from '../../services/storage.service';

@Module({
  imports: [DatabaseModule, AnalyticsModule, PlaidModule, BillingModule],
  controllers: [PlatformController],
  providers: [
    NotificationService,
    FeatureFlagService,
    AdminService,
    IntegrationService,
    ReportService,
    VerificationService,
    AdvisorService,
    HouseholdService,
    ComplianceService,
    CategoryService,
    PlatformAdminGuard,
    StorageService,
  ],
  exports: [ComplianceService],
})
export class PlatformModule {}
