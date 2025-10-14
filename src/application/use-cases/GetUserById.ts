// src/application/use-cases/GetUserById.ts
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }
}