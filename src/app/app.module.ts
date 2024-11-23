import { Module } from '@nestjs/common';
import { CastingModule } from './casting/casting.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { GcsModule } from './gcs/gcs.module';
import { ContactModule } from './contact/contact.module';
import { PaymentModule } from './payment/payment.module';
import configuration from 'src/config/configuration';
import databaseConfig from 'src/config/database.config';
import gcpConfig from 'src/config/gcp.config';
import paymentConfig from 'src/config/payment.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, databaseConfig, gcpConfig, paymentConfig],
    }),
    CastingModule,
    DatabaseModule,
    GcsModule,
    ContactModule,
    PaymentModule,
  ],
})
export class AppModule {}
