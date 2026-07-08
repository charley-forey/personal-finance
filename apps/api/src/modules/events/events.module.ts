import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database.module';
import { EventsController } from './events.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [EventsController],
})
export class EventsModule {}
