// src/application/use-cases/CreateUser.ts
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { v4 as uuidv4 } from 'uuid';

export interface CreateUserDTO {
  username: string;
  email: string;
  name: string;
  password: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<User> {
    const email = new Email(data.email);
    
    // Verificar si el email ya existe
    const existingUserByEmail = await this.userRepository.findByEmail(email.getValue());
    if (existingUserByEmail) {
      throw new Error('Ya existe un usuario con este email');
    }

    // Verificar si el username ya existe
    const existingUserByUsername = await this.userRepository.findByUsername(data.username);
    if (existingUserByUsername) {
      throw new Error('Ya existe un usuario con este username');
    }

    const user = new User(
      uuidv4(),
      data.username,
      email,
      data.name,
      data.password
    );

    return await this.userRepository.save(user);
  }
}