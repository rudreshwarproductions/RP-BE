import { Module } from '@nestjs/common';
import { CastModule } from './user/user.module';

@Module({
  imports: [CastModule],
})
export class AppModule {}
