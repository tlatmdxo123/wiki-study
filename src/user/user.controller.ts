import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  Param,
  UseGuards,
  Inject,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserInfo } from './types/userInfo';
import { AuthGuard } from 'src/auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    return this.userService.getUserInfo(userId);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    this.printWinstonLog(createUserDto);
    const { name, email, password } = createUserDto;
    await this.userService.createUser(name, email, password);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto) {
    const { signupVerifyToken } = dto;

    await this.userService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    return await this.userService.login(email, password);
  }

  private printWinstonLog(dto) {
    this.logger.error('error: ', dto);
    this.logger.warn('warn: ', dto);
    this.logger.verbose('verbose: ', dto);
    this.logger.debug('debug: ', dto);
  }
}
