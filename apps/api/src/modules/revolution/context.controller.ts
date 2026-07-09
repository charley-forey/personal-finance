import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { getAuth } from '../../common/auth.guard';
import { ContextService } from '../../services/context.service';

@ApiTags('context')
@Controller('context')
@ApiBearerAuth()
export class ContextController {
  constructor(private context: ContextService) {}

  @Get('page')
  async page(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Query('route') route: string) {
    const auth = getAuth(req);
    return this.context.pageContext(auth.orgId, route ?? '/app');
  }
}
