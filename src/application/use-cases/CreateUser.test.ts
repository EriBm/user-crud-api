import { CreateUserUseCase } from './CreateUser';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';

describe('CreateUserUseCase', () => {
  let mockRepository: jest.Mocked<IUserRepository>;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };
    useCase = new CreateUserUseCase(mockRepository);
  });

  it('debería crear un usuario exitosamente', async () => {
    const userData = {
      username: 'johndoe',
      email: 'john@example.com',
      name: 'John Doe',
      password: 'password123',
    };

    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.findByUsername.mockResolvedValue(null);
    mockRepository.save.mockImplementation(async (user) => user);

    const result = await useCase.execute(userData);

    expect(result.username).toBe(userData.username);
    expect(result.email.getValue()).toBe(userData.email);
    expect(result.name).toBe(userData.name);
    expect(result.password).toBe(userData.password);
    expect(mockRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(mockRepository.findByUsername).toHaveBeenCalledWith(userData.username);
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('debería lanzar error si el email ya existe', async () => {
    const userData = {
      username: 'johndoe',
      email: 'existing@example.com',
      name: 'John Doe',
      password: 'password123',
    };

    const existingUser = new User(
      '1',
      'existinguser',
      new Email('existing@example.com'),
      'Existing User',
      'password123'
    );
    mockRepository.findByEmail.mockResolvedValue(existingUser);
    mockRepository.findByUsername.mockResolvedValue(null);

    await expect(useCase.execute(userData)).rejects.toThrow(
      'Ya existe un usuario con este email'
    );
  });

  it('debería lanzar error si el username ya existe', async () => {
    const userData = {
      username: 'existinguser',
      email: 'john@example.com',
      name: 'John Doe',
      password: 'password123',
    };

    const existingUser = new User(
      '1',
      'existinguser',
      new Email('existing@example.com'),
      'Existing User',
      'password123'
    );
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.findByUsername.mockResolvedValue(existingUser);

    await expect(useCase.execute(userData)).rejects.toThrow(
      'Ya existe un usuario con este username'
    );
  });
});