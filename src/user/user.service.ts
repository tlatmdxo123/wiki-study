import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { EmailService } from 'src/email/email.service';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private datasource: DataSource,
  ) {}

  // async getUserInfo(userId: string): Promise<UserInfo> {
  //   //1.userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러처리
  //   //2. 조회된 데이터를 UserInfo타입으로 응답

  //   throw new Error('method not implemented');
  // }

  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다',
      );
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  async checkUserExists(emailAddress: string) {
    const user = await this.userRepository.findOneBy({ email: emailAddress });

    return user !== null;
  }

  async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.datasource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (e) {
      //에러가 발생하면 롤백
      queryRunner.rollbackTransaction();
    } finally {
      //직접 생성한 queryRunner는 해제시켜 줘야함
      await queryRunner.release();
    }
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
