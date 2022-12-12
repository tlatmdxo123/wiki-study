import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IUserRepository } from '../../../domain/repository/iuser.repository';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../../entities/user.entity';
import { UserFactory } from '../../../domain/user.factory';
import { User } from '../../../domain/user';
import { ulid } from 'ulid';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private datasource: DataSource,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) {}

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOneBy({ id });
    if (!userEntity) return null;

    const { email, name, signupVerifyToken, password } = userEntity;
    return this.userFactory.reconstitute(
      id,
      name,
      email,
      signupVerifyToken,
      password,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOneBy({ email });
    if (!userEntity) return null;

    const { id, name, signupVerifyToken, password } = userEntity;
    return this.userFactory.reconstitute(
      id,
      name,
      email,
      signupVerifyToken,
      password,
    );
  }

  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const userEntity = await this.userRepository.findOneBy({ email, password });
    if (!userEntity) return null;

    const { id, name, signupVerifyToken } = userEntity;
    return this.userFactory.reconstitute(
      id,
      name,
      email,
      signupVerifyToken,
      password,
    );
  }

  async findBySignupVerifyToken(
    signupVerifyToken: string,
  ): Promise<User | null> {
    const userEntity = await this.userRepository.findOneBy({
      signupVerifyToken,
    });
    if (!userEntity) return null;

    const { id, name, email, password } = userEntity;
    return this.userFactory.reconstitute(
      id,
      name,
      email,
      signupVerifyToken,
      password,
    );
  }

  async save(
    id: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ): Promise<void> {
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
}
