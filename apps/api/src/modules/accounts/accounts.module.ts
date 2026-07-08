import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database.module';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AccountsController],
})
export class AccountsModule {}
