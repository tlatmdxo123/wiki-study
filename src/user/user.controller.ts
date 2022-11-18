import { Controller, Post, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get(':id')
  // async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
  //   return await this.userService.getUserInfo(userId);
  // }
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    await this.userService.createUser(name, email, password);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto) {
    const { signupVerifyToken } = dto;

    await this.userService.verifyEmail(signupVerifyToken);
  }
}
