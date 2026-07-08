import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { createDb, type Database } from '@pf/database';

export const DATABASE = 'DATABASE';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          url: config.get('REDIS_URL', 'redis://localhost:6379'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: DATABASE,
      useFactory: (config: ConfigService): Database => {
        const url = config.get<string>('DATABASE_URL');
        if (!url) {
          console.warn('DATABASE_URL not set — using in-memory fallback mode');
        }
        return createDb(url ?? 'postgresql://postgres:postgres@localhost:5432/personal_finance');
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE, BullModule, ConfigModule],
})
export class DatabaseModule {}
