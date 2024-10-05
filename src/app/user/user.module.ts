import { Module } from '@nestjs/common';
import { CastController } from './user.controller';
import { CastService } from './user.service';

@Module({
  controllers: [CastController],
  providers: [CastService],
})
export class CastModule {}
