import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LoginCommand } from './login.command';
import { AuthService } from '../../auth/auth.service';
import { UserRepository } from '../infra/db/repository/UserRepository';

@Injectable()
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject('UserRepository') private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async execute(command: LoginCommand): Promise<any> {
    const { email, password } = command;
    const user = await this.userRepository.findByEmailAndPassword(
      email,
      password,
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
