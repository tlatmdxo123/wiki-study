import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';

@Injectable()
export class UserService {
  constructor(private emailService: EmailService) {}

  // async getUserInfo(userId: string): Promise<UserInfo> {
  //   //1.userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러처리
  //   //2. 조회된 데이터를 UserInfo타입으로 응답

  //   throw new Error('method not implemented');
  // }

  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  async checkUserExists(email: string) {
    return false; //@Todo db연동 후 구현
  }

  async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    return; //@Todo db연동 후 구현
  }

  async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(signupVerifyToken: string) {
    //Todo
    //1. DB에서 signupVerifyToken으로 회원가입 처리중인 유저가 있는지 조회하고 없다면 에러처리
    //2. 바로 로그인 상태가 되도록 JWT발급

    throw new Error('method not implemented');
  }
}
