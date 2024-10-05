import { Module } from '@nestjs/common';
import { CastingModule } from './casting/casting.module';

@Module({
  imports: [CastingModule],
})
export class AppModule {}
