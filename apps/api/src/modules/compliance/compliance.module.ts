import { Module } from '@nestjs/common';
import { PlatformModule } from '../platform/platform.module';
import { ComplianceController } from './compliance.controller';

@Module({
  imports: [PlatformModule],
  controllers: [ComplianceController],
})
export class ComplianceModule {}
