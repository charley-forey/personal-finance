import { Controller, Get, Post, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { getAuth } from '../../common/auth.guard';
import { GraphService } from '../../services/graph.service';

@ApiTags('graph')
@Controller('graph')
@ApiBearerAuth()
export class GraphController {
  constructor(private graph: GraphService) {}

  @Get('entity/:type/:id/neighbors')
  async neighbors(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Param('type') type: string,
    @Param('id') id: string,
  ) {
    const auth = getAuth(req);
    const neighbors = await this.graph.neighbors(auth.orgId, type, id);
    return { neighbors };
  }

  @Get('context')
  async context(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Query('route') route: string) {
    const auth = getAuth(req);
    return this.graph.context(auth.orgId, route ?? '/app');
  }

  @Post('links')
  async createLink(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: Record<string, unknown>) {
    const auth = getAuth(req);
    const link = await this.graph.link(auth.orgId, body as Parameters<GraphService['link']>[1]);
    return { link };
  }
}
