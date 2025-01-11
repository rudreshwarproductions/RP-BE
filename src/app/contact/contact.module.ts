import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports: [DatabaseModule],
})
export class ContactModule {}
