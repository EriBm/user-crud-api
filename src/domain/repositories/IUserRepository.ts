
// src/domain/repositories/IUserRepository.ts
import { User } from '../entities/User';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findAll(includeInactive?: boolean): Promise<User[]>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}