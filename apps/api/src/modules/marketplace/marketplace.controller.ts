import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('marketplace')
@Controller('marketplace')
@ApiBearerAuth()
export class MarketplaceController {
  @Get('integrations')
  listIntegrations() {
    return {
      integrations: [
        { id: 'slack', name: 'Slack', category: 'notifications', status: 'available' },
        { id: 'zapier', name: 'Zapier', category: 'automation', status: 'available' },
        { id: 'quickbooks', name: 'QuickBooks', category: 'accounting', status: 'available' },
        { id: 'google_sheets', name: 'Google Sheets', category: 'reporting', status: 'available' },
      ],
    };
  }
}
