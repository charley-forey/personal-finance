import { Controller, Get, Put, Body, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard, getAuth } from '../../common/auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from '../../dto/update-profile.dto';

@ApiTags('profile')
@Controller('profile')
@ApiBearerAuth()
export class ProfileController {
  constructor(private profile: ProfileService) {}

  @Get()
  async getProfile(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    const profile = await this.profile.get(auth.orgId, auth.userId);
    if (!profile) return { profile: null };
    return {
      profile: {
        ...profile,
        annualIncome: profile.annualIncome ? parseFloat(profile.annualIncome) : undefined,
      },
    };
  }

  @Put()
  async updateProfile(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: UpdateProfileDto) {
    const auth = getAuth(req);
    const profile = await this.profile.upsert(auth.orgId, auth.userId, body);
    return {
      profile: {
        ...profile,
        annualIncome: profile.annualIncome ? parseFloat(profile.annualIncome) : undefined,
      },
    };
  }
}
