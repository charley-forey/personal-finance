import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database.module';
import { BillingModule } from '../billing/billing.module';
import { PlatformModule } from '../platform/platform.module';
import { PlatformAdminGuard } from '../../common/platform-admin.guard';
import { AdminController } from './admin.controller';
import { AdminRbacService, AdminDirectoryService } from './admin-directory.service';
import { AdminMetricsService, AdminControlService } from './admin-ops.service';
import {
  AdminOpsReliabilityService,
  AdminSupportService,
  AdminTrustService,
  AdminAiGovService,
  AdminScaleService,
} from './admin-support.service';

@Module({
  imports: [DatabaseModule, BillingModule, PlatformModule],
  controllers: [AdminController],
  providers: [
    PlatformAdminGuard,
    AdminRbacService,
    AdminDirectoryService,
    AdminMetricsService,
    AdminControlService,
    AdminOpsReliabilityService,
    AdminSupportService,
    AdminTrustService,
    AdminAiGovService,
    AdminScaleService,
  ],
  exports: [AdminRbacService],
})
export class AdminModule {}
