import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('banking')
@Controller('banking')
@ApiBearerAuth()
export class BankingController {
  @Get('providers')
  listProviders() {
    return {
      providers: [
        {
          id: 'plaid',
          name: 'Plaid',
          type: 'aggregator',
          status: 'active',
          description: 'Connect bank accounts via Plaid Link',
        },
        {
          id: 'manual',
          name: 'Manual Entry',
          type: 'manual',
          status: 'active',
          description: 'Add assets and accounts manually',
        },
      ],
    };
  }
}
