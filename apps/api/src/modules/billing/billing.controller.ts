import { Controller, Get, Post, Body, Req, Headers, RawBodyRequest } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard, Public, getAuth, RequireRoles } from '../../common/auth.guard';
import { BillingService } from '../../services/billing.service';
import { CheckoutDto } from '../../dto';

@ApiTags('billing')
@Controller()
@ApiBearerAuth()
export class BillingController {
  constructor(private billing: BillingService) {}

  @Get('billing/plan')
  async plan(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.billing.getPlanSummary(auth.orgId);
  }

  @Post('billing/checkout')
  @RequireRoles('owner')
  async checkout(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Body() body: CheckoutDto) {
    const auth = getAuth(req);
    return this.billing.createCheckoutSession(auth.orgId, body.priceId);
  }

  @Public()
  @Post('webhooks/stripe')
  async stripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') signature: string) {
    const rawBody = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
    return this.billing.handleWebhook(rawBody, signature);
  }
}
