// src/application/use-cases/DeleteUser.ts
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    user.softDelete();
    await this.userRepository.update(user);
  }
}