import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { UserController } from './user.controller';
import { EmailModule } from 'src/email/email.module';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserEventsHandler } from './event/user-events.handler';
import { CreateUserHandler } from './command/create-user.handler';
import { VerifyEmailCommand } from './command/verify-email.command';
import { LoginHandler } from './command/login.handler';
import { GetUserInfoQueryHandler } from './query/get-user-info.handler';
import { UserFactory } from './domain/user.factory';
import { UserRepository } from './infra/db/repository/UserRepository';

const commandHandlers = [CreateUserHandler, VerifyEmailCommand, LoginHandler];
const eventHandler = [UserEventsHandler];
const queryHandlers = [GetUserInfoQueryHandler];
const factories = [UserFactory];

const repositories = [{ provide: 'UserFactory', useClass: UserRepository }];

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    CqrsModule,
  ],
  controllers: [UserController],
  providers: [
    Logger,
    ...commandHandlers,
    ...eventHandler,
    ...queryHandlers,
    ...factories,
    ...repositories,
  ],
})
export class UserModule {}
