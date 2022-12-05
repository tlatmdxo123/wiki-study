import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserInfo } from './types/userInfo';
import { AuthGuard } from 'src/auth.guard';
import { CreateUserCommand } from './command/create-user.command';
import { VerifyEmailCommand } from './command/verify-email.command';
import { LoginCommand } from './command/login.command';
import { GetUserInfoQuery } from './query/get-user-info.query';

@Controller('users')
export class UserController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    const getUserInfoQuery = new GetUserInfoQuery(userId);

    return this.queryBus.execute(getUserInfoQuery);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const command = new CreateUserCommand(name, email, password);

    return this.commandBus.execute(command);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto) {
    const { signupVerifyToken } = dto;

    const command = new VerifyEmailCommand(signupVerifyToken);
    return this.commandBus.execute(command);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const command = new LoginCommand(email, password);
    return this.commandBus.execute(command);
  }
}
