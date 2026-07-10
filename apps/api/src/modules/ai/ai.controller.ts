import { Controller, Get, Post, Body, Query, Req, Inject, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { eq, desc, and } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { insights, agentMemories } from '@pf/database';
import { AuthGuard, getAuth, RequireRoles } from '../../common/auth.guard';
import { AnalyticsService } from '../../services/analytics.services';
import { KnowledgeService } from '../../services/platform.services';
import { IntelligenceService } from '../../services/intelligence.service';
import { DATABASE } from '../../database.module';
import { AgentChatDto, InsightFeedbackDto, RecordSignalDto } from '../../dto';
import { PlanLimitsGuard, RequirePlanLimit } from '../billing/plan-limits.guard';

@ApiTags('ai')
@Controller()
@ApiBearerAuth()
export class AiController {
  constructor(
    private analytics: AnalyticsService,
    private knowledge: KnowledgeService,
    private intelligence: IntelligenceService,
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

  @Get('agents/conversations')
  async agentConversations(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.analytics.getAgentConversations(auth.orgId, auth.userId);
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

  @Post('insights/:id/feedback')
  async insightFeedback(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Param('id') insightId: string,
    @Body() body: InsightFeedbackDto,
  ) {
    const auth = getAuth(req);
    return this.intelligence.recordInsightFeedback(auth.orgId, auth.userId, {
      insightId,
      ...body,
    });
  }

  @Get('recommendations')
  async listRecommendations(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.intelligence.listRecommendations(auth.orgId);
  }

  @Post('recommendations/generate')
  async generateRecommendations(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.intelligence.generateRecommendations(auth.orgId, auth.userId);
  }

  @Post('recommendations/:id/outcome')
  async recommendationOutcome(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Param('id') id: string,
    @Body() body: { outcome: string; notes?: string },
  ) {
    const auth = getAuth(req);
    return this.intelligence.completeRecommendation(auth.orgId, id, body.outcome, body.notes);
  }

  @Post('signals')
  async recordSignal(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Body() body: RecordSignalDto,
  ) {
    const auth = getAuth(req);
    return this.intelligence.recordUserSignal(auth.orgId, auth.userId, body);
  }
}
