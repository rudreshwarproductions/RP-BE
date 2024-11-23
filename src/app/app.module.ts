import { Module } from '@nestjs/common';
import { CastingModule } from './casting/casting.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { GcsModule } from './gcs/gcs.module';
import { ContactModule } from './contact/contact.module';
import configuration from 'src/config/configuration';
import databaseConfig from 'src/config/database.config';
import gcpConfig from 'src/config/gcp.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, databaseConfig, gcpConfig],
    }),
    CastingModule,
    DatabaseModule,
    GcsModule,
    ContactModule,
  ],
})
export class AppModule {}
