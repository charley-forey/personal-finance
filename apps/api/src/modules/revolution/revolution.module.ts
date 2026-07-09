import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database.module';
import { GraphService } from '../../services/graph.service';
import { ContextService } from '../../services/context.service';
import { NarrativeService } from '../../services/narrative.service';
import { JourneyService } from '../../services/journey.service';
import { GraphController } from './graph.controller';
import { ContextController } from './context.controller';
import { NarrativeController } from './narrative.controller';
import { JourneyController } from './journey.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [GraphController, ContextController, NarrativeController, JourneyController],
  providers: [GraphService, ContextService, NarrativeService, JourneyService],
  exports: [GraphService, ContextService, NarrativeService, JourneyService],
})
export class RevolutionModule {}
