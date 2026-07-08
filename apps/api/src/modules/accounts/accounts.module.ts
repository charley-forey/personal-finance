import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database.module';
import { CategoryService } from '../../services/category.service';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AccountsController],
  providers: [CategoryService],
})
export class AccountsModule {}
