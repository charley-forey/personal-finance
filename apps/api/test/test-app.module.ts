import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from '../src/database.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { AuthGuard, RolesGuard } from '../src/common/auth.guard';
import { HealthModule } from '../src/modules/health/health.module';
import { AccountsModule } from '../src/modules/accounts/accounts.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 120 }]),
    LoggerModule.forRoot({ pinoHttp: { autoLogging: false } }),
    DatabaseModule,
    AuthModule,
    HealthModule,
    AccountsModule,
  ],
  providers: [
    { provide: APP_GUARD, useExisting: AuthGuard },
    { provide: APP_GUARD, useExisting: RolesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class TestAppModule {}
