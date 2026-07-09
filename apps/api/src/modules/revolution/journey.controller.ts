import { Controller, Get, Post, Param, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { getAuth } from '../../common/auth.guard';
import { JourneyService } from '../../services/journey.service';

@ApiTags('journey')
@Controller('journey')
@ApiBearerAuth()
export class JourneyController {
  constructor(private journey: JourneyService) {}

  @Get('progress')
  async progress(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return { hubs: await this.journey.getProgress(auth.orgId, auth.userId) };
  }

  @Post('progress/:hubId/step/:stepId')
  async completeStep(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Param('hubId') hubId: string,
    @Param('stepId') stepId: string,
  ) {
    const auth = getAuth(req);
    const row = await this.journey.completeStep(auth.orgId, hubId, stepId, auth.userId);
    return { progress: row };
  }
}
