import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EmailService } from './email/email.service';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
