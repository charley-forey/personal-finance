import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { getAuth } from '../../common/auth.guard';
import { NarrativeService } from '../../services/narrative.service';

@ApiTags('narrative')
@Controller('narrative')
@ApiBearerAuth()
export class NarrativeController {
  constructor(private narrative: NarrativeService) {}

  @Get('session')
  async session(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.narrative.session(auth.orgId);
  }

  @Get('page')
  async page(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Query('route') route: string) {
    const auth = getAuth(req);
    return this.narrative.page(auth.orgId, route ?? '/app');
  }

  @Get('explain')
  async explain(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Query('metric') metric: string) {
    const auth = getAuth(req);
    return this.narrative.explain(auth.orgId, metric ?? 'net_worth');
  }
}
