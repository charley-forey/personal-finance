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
  OrgMembersService,
  ConsentService,
} from '../../services/platform.services';
import { PlatformAdminGuard } from '../../common/platform-admin.guard';
import { PlatformController } from './platform.controller';
import { StorageService } from '../../services/storage.service';
import { RetentionSweeperService } from '../../services/retention-sweeper.service';
import { AuthAnomalyService } from '../../services/auth-anomaly.service';

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
    OrgMembersService,
    ConsentService,
    CategoryService,
    PlatformAdminGuard,
    StorageService,
    RetentionSweeperService,
    AuthAnomalyService,
  ],
  exports: [ComplianceService, OrgMembersService, ConsentService, RetentionSweeperService, AuthAnomalyService],
})
export class PlatformModule {}
