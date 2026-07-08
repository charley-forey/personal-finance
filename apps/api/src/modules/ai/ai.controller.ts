import { Controller, Get, Post, Body, Query, Req, Inject, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { eq, desc, and } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { insights, agentMemories } from '@pf/database';
import { AuthGuard, getAuth, RequireRoles } from '../../common/auth.guard';
import { AnalyticsService } from '../../services/analytics.services';
import { KnowledgeService } from '../../services/platform.services';
import { DATABASE } from '../../database.module';
import { AgentChatDto } from '../../dto';
import { PlanLimitsGuard, RequirePlanLimit } from '../billing/plan-limits.guard';

@ApiTags('ai')
@Controller()
@ApiBearerAuth()
export class AiController {
  constructor(
    private analytics: AnalyticsService,
    private knowledge: KnowledgeService,
    @Inject(DATABASE) private db: Database,
  ) {}

  @Get('insights')
  async listInsights(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db
      .select()
      .from(insights)
      .where(eq(insights.orgId, auth.orgId))
      .orderBy(desc(insights.generatedAt))
      .limit(20);
  }

  @Post('insights/generate')
  async generateInsight(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.analytics.generateAiInsight(auth.orgId);
  }

  @Post('agents/chat')
  @UseGuards(PlanLimitsGuard)
  @RequirePlanLimit('ai_messages')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async agentChat(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: AgentChatDto) {
    const auth = getAuth(req);
    return this.analytics.chatAgent(
      auth.orgId,
      auth.userId,
      body.agentType as 'general_cfo',
      body.message,
      body.conversationId,
    );
  }

  @Get('agents/memories')
  async agentMemories(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db
      .select()
      .from(agentMemories)
      .where(and(eq(agentMemories.orgId, auth.orgId), eq(agentMemories.userId, auth.userId)));
  }

  @Post('agents/memories')
  async createAgentMemory(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Body() body: { content: string; memoryType: string },
  ) {
    const auth = getAuth(req);
    const [memory] = await this.db
      .insert(agentMemories)
      .values({ orgId: auth.orgId, userId: auth.userId, content: body.content, memoryType: body.memoryType, source: 'user' })
      .returning();
    return memory;
  }

  @Get('knowledge/search')
  async knowledgeSearch(@Query('q') q: string, @Query('domain') domain?: string) {
    return this.knowledge.search(q ?? '', domain);
  }

  @Post('knowledge/ingest')
  @RequireRoles('admin')
  async ingestKnowledge() {
    return this.knowledge.ingest();
  }
}
