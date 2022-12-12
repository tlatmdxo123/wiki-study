import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { VerifyEmailCommand } from './verify-email.command';
import { AuthService } from '../../auth/auth.service';
import { UserRepository } from '../infra/db/repository/UserRepository';

@Injectable()
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    @Inject('UserRepository') private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async execute(command: VerifyEmailCommand) {
    const { signupVerifyToken } = command;
    const user = await this.userRepository.findBySignupVerifyToken(
      signupVerifyToken,
    );

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return this.authService.login({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
    });
  }
}
