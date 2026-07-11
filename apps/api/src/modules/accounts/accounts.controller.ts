import { Controller, Get, Patch, Body, Param, Query, Req, Inject, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { eq, desc, and, or, ilike } from 'drizzle-orm';
import type { Database } from '@pf/database';
import { accounts, accountBalances, transactions } from '@pf/database';
import { purposeFromAccount } from '@pf/shared';
import { getAuth, RequireRoles } from '../../common/auth.guard';
import { DATABASE } from '../../database.module';
import { UpdateTransactionDto, UpdateAccountDto } from '../../dto';
import { CategoryService } from '../../services/category.service';

@ApiTags('accounts')
@Controller()
@ApiBearerAuth()
export class AccountsController {
  constructor(
    @Inject(DATABASE) private db: Database,
    private categories: CategoryService,
  ) {}

  @Get('accounts')
  async listAccounts(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Query('includeHidden') includeHidden?: string,
  ) {
    const auth = getAuth(req);
    const rows = await this.db.select().from(accounts).where(eq(accounts.orgId, auth.orgId));
    const filtered = includeHidden === 'true' ? rows : rows.filter((a) => !a.isHidden);

    const withBalances = await Promise.all(
      filtered.map(async (acct) => {
        const [balance] = await this.db
          .select()
          .from(accountBalances)
          .where(eq(accountBalances.accountId, acct.id))
          .orderBy(desc(accountBalances.capturedAt))
          .limit(1);
        const purpose = purposeFromAccount(acct);
        return {
          ...acct,
          purpose,
          displayName: acct.displayName ?? acct.name,
          currentBalance: balance?.current ?? null,
          availableBalance: balance?.available ?? null,
          balanceCapturedAt: balance?.capturedAt ?? null,
          balanceSyncJobId: balance?.syncJobId ?? null,
        };
      }),
    );
    return withBalances;
  }

  @Get('accounts/:id')
  async getAccount(@Req() req: { auth?: ReturnType<typeof getAuth> }, @Param('id') id: string) {
    const auth = getAuth(req);
    const [account] = await this.db
      .select()
      .from(accounts)
      .where(and(eq(accounts.id, id), eq(accounts.orgId, auth.orgId)))
      .limit(1);
    if (!account) throw new NotFoundException('Account not found');
    return { ...account, purpose: purposeFromAccount(account) };
  }

  @Get('accounts/:id/balances')
  async accountBalanceHistory(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Param('id') id: string,
    @Query('limit') limit = '90',
  ) {
    const auth = getAuth(req);
    const [account] = await this.db
      .select()
      .from(accounts)
      .where(and(eq(accounts.id, id), eq(accounts.orgId, auth.orgId)))
      .limit(1);
    if (!account) throw new NotFoundException('Account not found');

    return this.db
      .select()
      .from(accountBalances)
      .where(eq(accountBalances.accountId, id))
      .orderBy(desc(accountBalances.capturedAt))
      .limit(parseInt(limit, 10) || 90);
  }

  @Patch('accounts/:id')
  @RequireRoles('admin')
  async updateAccount(
    @Req() req: { auth?: ReturnType<typeof getAuth> },
    @Param('id') id: string,
    @Body() body: UpdateAccountDto,
  ) {
    const auth = getAuth(req);
    const [existing] = await this.db
      .select()
      .from(accounts)
      .where(and(eq(accounts.id, id), eq(accounts.orgId, auth.orgId)))
      .limit(1);
    if (!existing) throw new NotFoundException('Account not found');

    const patch: Partial<typeof accounts.$inferInsert> = {};
    if (body.displayName !== undefined) patch.displayName = body.displayName;
    if (body.isHidden !== undefined) patch.isHidden = body.isHidden;
    if (body.purpose !== undefined) {
      patch.purpose = body.purpose;
      patch.purposeOverride = true;
    }

    const [updated] = await this.db
      .update(accounts)
      .set(patch)
      .where(and(eq(accounts.id, id), eq(accounts.orgId, auth.orgId)))
      .returning();

    return { ...updated, purpose: purposeFromAccount(updated!) };
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
    const [existing] = await this.db
      .select()
      .from(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.orgId, auth.orgId)))
      .limit(1);

    if (!existing) {
      throw new NotFoundException('Transaction not found');
    }

    const categoryChanged =
      body.categoryId !== undefined && body.categoryId !== existing.categoryId;

    const [updated] = await this.db
      .update(transactions)
      .set({ ...body, updatedAt: new Date() })
      .where(and(eq(transactions.id, id), eq(transactions.orgId, auth.orgId)))
      .returning();

    if (categoryChanged && body.categoryId) {
      await this.categories.recordCategorizationCorrection(auth.orgId, auth.userId, {
        transactionId: id,
        priorCategoryId: existing.categoryId,
        newCategoryId: body.categoryId,
        merchantName: existing.merchantName ?? existing.name,
      });
    }

    return updated;
  }
}
