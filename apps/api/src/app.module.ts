import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';



import { APP_GUARD, APP_FILTER } from '@nestjs/core';



import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';



import { LoggerModule } from 'nestjs-pino';



import { DatabaseModule } from './database.module';



import { AuthGuard, RolesGuard } from './common/auth.guard';



import { GlobalExceptionFilter } from './common/global-exception.filter';

import { AuditMiddleware } from './common/audit.middleware';



import { HealthModule } from './modules/health/health.module';

import { PlaidModule } from './modules/plaid/plaid.module';

import { AccountsModule } from './modules/accounts/accounts.module';

import { AnalyticsModule } from './modules/analytics/analytics.module';

import { AiModule } from './modules/ai/ai.module';

import { BillingModule } from './modules/billing/billing.module';

import { PlatformModule } from './modules/platform/platform.module';

import { EventsModule } from './modules/events/events.module';

import { AuthModule } from './modules/auth/auth.module';

import { MarketplaceModule } from './modules/marketplace/marketplace.module';

import { BankingModule } from './modules/banking/banking.module';

import { ComplianceModule } from './modules/compliance/compliance.module';

import { ProfileModule } from './modules/profile/profile.module';



@Module({

  imports: [

    ThrottlerModule.forRoot([

      {

        name: 'default',

        ttl: 60000,

        limit: 120,

      },

    ]),

    LoggerModule.forRoot({

      pinoHttp: {

        transport:

          process.env.NODE_ENV !== 'production'

            ? { target: 'pino-pretty', options: { singleLine: true } }

            : undefined,

        autoLogging: true,

        redact: ['req.headers.authorization'],

      },

    }),

    DatabaseModule,

    AuthModule,

    HealthModule,

    PlaidModule,

    AccountsModule,

    AnalyticsModule,

    AiModule,

    BillingModule,

    PlatformModule,

    EventsModule,

    MarketplaceModule,

    BankingModule,

    ComplianceModule,

    ProfileModule,

  ],

  providers: [

    AuditMiddleware,

    { provide: APP_GUARD, useExisting: AuthGuard },

    { provide: APP_GUARD, useExisting: RolesGuard },

    { provide: APP_GUARD, useClass: ThrottlerGuard },

    { provide: APP_FILTER, useClass: GlobalExceptionFilter },

  ],

})

export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {

    consumer.apply(AuditMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });

  }

}


