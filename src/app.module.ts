import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [WhatsAppModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
