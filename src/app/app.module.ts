import { Module } from '@nestjs/common';
import { CastModule } from './cast/cast.module';

@Module({
  imports: [CastModule],
})
export class AppModule {}
