import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database.module';
import { AppController } from './app.controller';
import { PlaidService, AuthService } from './services/core.services';
import { AnalyticsService, PnlService, TaxService } from './services/analytics.services';
import {
  BillingService,
  NotificationService,
  FeatureFlagService,
  AdminService,
  IntegrationService,
  ReportService,
  VerificationService,
  KnowledgeService,
} from './services/platform.services';
import { AuthGuard, RolesGuard } from './common/auth.guard';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [
    PlaidService,
    AuthService,
    AnalyticsService,
    PnlService,
    TaxService,
    BillingService,
    NotificationService,
    FeatureFlagService,
    AdminService,
    IntegrationService,
    ReportService,
    VerificationService,
    KnowledgeService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
