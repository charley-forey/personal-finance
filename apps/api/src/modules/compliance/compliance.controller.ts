import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { getAuth } from '../../common/auth.guard';
import { ComplianceService } from '../../services/platform.services';

@ApiTags('compliance')
@Controller('compliance')
@ApiBearerAuth()
export class ComplianceController {
  constructor(private compliance: ComplianceService) {}

  @Get('sso-config')
  async ssoConfig(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.compliance.getSsoConfig(auth.orgId);
  }
}
