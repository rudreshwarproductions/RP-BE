import { Module } from '@nestjs/common';
import { CastingController } from './casting.controller';
import { CastingService } from './casting.service';
import { DatabaseService } from '../database/database.service';
import { DatabaseModule } from '../database/database.module';
import { GcsModule } from '../gcs/gcs.module';

@Module({
  controllers: [CastingController],
  providers: [CastingService],
  imports: [DatabaseModule, GcsModule],
})
export class CastingModule {}
