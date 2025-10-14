// src/application/use-cases/ListUsers.ts
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(includeInactive: boolean = false): Promise<User[]> {
    return await this.userRepository.findAll(includeInactive);
  }
}