import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from './cqrs-event';

export class UserCreatedEvent extends CqrsEvent implements IEvent {
  constructor(
    public readonly email: string,
    public readonly signupVerifyToken: string,
  ) {
    super(UserCreatedEvent.name);
  }
}
