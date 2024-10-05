import { Module } from '@nestjs/common';
import { CastingModule } from './casting/casting.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import configuration from 'src/config/configuration';
import databaseConfig from 'src/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, databaseConfig],
    }),
    CastingModule,
    DatabaseModule,
  ],
})
export class AppModule {}
