import { Controller, Get, Patch, Body, Param, Query, Req, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { eq, desc, and, or, ilike } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { accounts, transactions } from '@pf/database';
import { AuthGuard, getAuth, RequireRoles } from '../../common/auth.guard';
import { DATABASE } from '../../database.module';
import { UpdateTransactionDto } from '../../dto';

@ApiTags('accounts')
@Controller()
@ApiBearerAuth()
export class AccountsController {
  constructor(@Inject(DATABASE) private db: Database) {}

  @Get('accounts')
  async listAccounts(@Req() req: { auth?: ReturnType<typeof getAuth> }) {
    const auth = getAuth(req);
    return this.db.select().from(accounts).where(eq(accounts.orgId, auth.orgId));
  }

  @Get('accounts/:id')
  async getAccount(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Param('id') id: string) {
    const auth = getAuth(req);
    const [account] = await this.db
      .select()
      .from(accounts)
      .where(and(eq(accounts.id, id), eq(accounts.orgId, auth.orgId)))
      .limit(1);
    return account;
  }

  @Get('transactions')
  async listTransactions(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Query('limit') limit = '50',
    @Query('offset') offset = '0',
    @Query('search') search?: string,
  ) {
    const auth = getAuth(req);
    const orgFilter = eq(transactions.orgId, auth.orgId);
    const whereClause = search
      ? and(
          orgFilter,
          or(
            ilike(transactions.name, `%${search}%`),
            ilike(transactions.merchantName, `%${search}%`),
          ),
        )
      : orgFilter;

    return this.db
      .select()
      .from(transactions)
      .where(whereClause)
      .orderBy(desc(transactions.date))
      .limit(parseInt(limit))
      .offset(parseInt(offset));
  }

  @Patch('transactions/:id')
  @RequireRoles('admin')
  async updateTransaction(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Param('id') id: string,
    @Body() body: UpdateTransactionDto,
  ) {
    const auth = getAuth(req);
    const [updated] = await this.db
      .update(transactions)
      .set({ ...body, updatedAt: new Date() })
      .where(and(eq(transactions.id, id), eq(transactions.orgId, auth.orgId)))
      .returning();
    return updated;
  }
}
