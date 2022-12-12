import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { User } from './user';
import { UserCreatedEvent } from '../event/user-created.event';

@Injectable()
export class UserFactory {
  constructor(private eventBus: EventBus) {}

  create(
    id: string,
    name: string,
    email: string,
    signupVerifyToken: string,
    password: string,
  ): User {
    const user = new User(id, name, email, password, signupVerifyToken);

    this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));

    return user;
  }

  reconstitute(
    id: string,
    name: string,
    email: string,
    signupVerifyToken: string,
    password: string,
  ): User {
    return new User(id, name, email, password, signupVerifyToken);
  }
}
