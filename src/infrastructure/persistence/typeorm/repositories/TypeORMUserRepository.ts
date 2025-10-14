import { Repository } from 'typeorm';
import { UserEntity } from '../entities/UserEntity';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { User } from '../../../../domain/entities/User';
import { Email } from '../../../../domain/value-objects/Email';

export class TypeORMUserRepository implements IUserRepository {
  constructor(private readonly repository: Repository<UserEntity>) {}

  private toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.username,
      new Email(entity.email),
      entity.name,
      entity.password,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.username = user.username;
    entity.email = user.email.getValue();
    entity.name = user.name;
    entity.password = user.password;
    entity.isActive = user.isActive;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }

  async save(user: User): Promise<User> {
    const entity = this.toEntity(user);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { username } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(includeInactive: boolean = false): Promise<User[]> {
    const where = includeInactive ? {} : { isActive: true };
    const entities = await this.repository.find({ where });
    return entities.map(entity => this.toDomain(entity));
  }

  async update(user: User): Promise<User> {
    const entity = this.toEntity(user);
    const updated = await this.repository.save(entity);
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }
}