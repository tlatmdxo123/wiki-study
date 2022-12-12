import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserRepository } from '../infra/db/repository/UserRepository';
import { GetUserInfoQuery } from './get-user-info.query';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoQueryHandler
  implements IQueryHandler<GetUserInfoQuery>
{
  constructor(
    @Inject('UserRepository') private userRepository: UserRepository,
  ) {}

  async execute(query: GetUserInfoQuery): Promise<any> {
    const { userId } = query;

    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException('유저가 존재하지 않습니다');

    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
    };
  }
}
