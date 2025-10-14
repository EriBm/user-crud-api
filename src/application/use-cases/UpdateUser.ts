// src/application/use-cases/UpdateUser.ts
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export interface UpdateUserDTO {
  id: string;
  username: string;
  email: string;
  name: string;
  password?: string;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.findById(data.id);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const newEmail = new Email(data.email);
    
    // Verificar si el email cambió y si ya existe
    if (!user.email.equals(newEmail)) {
      const existingUserByEmail = await this.userRepository.findByEmail(newEmail.getValue());
      if (existingUserByEmail && existingUserByEmail.id !== data.id) {
        throw new Error('Ya existe otro usuario con este email');
      }
    }

    // Verificar si el username cambió y si ya existe
    if (user.username !== data.username) {
      const existingUserByUsername = await this.userRepository.findByUsername(data.username);
      if (existingUserByUsername && existingUserByUsername.id !== data.id) {
        throw new Error('Ya existe otro usuario con este username');
      }
    }

    user.update(data.username, newEmail, data.name, data.password);
    
    return await this.userRepository.update(user);
  }
}