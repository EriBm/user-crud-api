// src/infrastructure/http/controllers/UserController.integration.test.ts
import 'reflect-metadata';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { createApp } from '../app';
import { createUserRoutes } from '../routes/userRoutes';
import { UserEntity } from '../../persistence/typeorm/entities/UserEntity';
import { TypeORMUserRepository } from '../../persistence/typeorm/repositories/TypeORMUserRepository';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUser';
import { GetUserByIdUseCase } from '../../../application/use-cases/GetUserById';
import { ListUsersUseCase } from '../../../application/use-cases/ListUsers';
import { UpdateUserUseCase } from '../../../application/use-cases/UpdateUser';
import { DeleteUserUseCase } from '../../../application/use-cases/DeleteUser';
import { UserController } from '../controllers/UserController';

describe('User API Integration Tests', () => {
  let dataSource: DataSource;
  let app: any;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      logging: false,
      entities: [UserEntity],
    });

    await dataSource.initialize();

    const userRepository = new TypeORMUserRepository(
      dataSource.getRepository(UserEntity)
    );

    const createUserUseCase = new CreateUserUseCase(userRepository);
    const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
    const listUsersUseCase = new ListUsersUseCase(userRepository);
    const updateUserUseCase = new UpdateUserUseCase(userRepository);
    const deleteUserUseCase = new DeleteUserUseCase(userRepository);

    const userController = new UserController(
      createUserUseCase,
      getUserByIdUseCase,
      listUsersUseCase,
      updateUserUseCase,
      deleteUserUseCase
    );

    const routes = createUserRoutes(userController);
    app = createApp(routes);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  afterEach(async () => {
    await dataSource.getRepository(UserEntity).clear();
  });

  describe('POST /api/users', () => {
    it('debería crear un usuario exitosamente', async () => {
      const userData = {
        username: 'johndoe',
        email: 'john@example.com',
        name: 'John Doe',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(userData.username);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.name).toBe(userData.name);
      expect(response.body).not.toHaveProperty('password'); // No debe exponerse
      expect(response.body.isActive).toBe(true);
    });

    it('debería retornar 400 si faltan campos obligatorios', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ username: 'john' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('debería retornar 400 con email inválido', async () => {
      const userData = {
        username: 'johndoe',
        email: 'invalid-email',
        name: 'John Doe',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.error).toContain('email');
    });

    it('debería retornar 400 si el email ya existe', async () => {
      const userData = {
        username: 'johndoe',
        email: 'john@example.com',
        name: 'John Doe',
        password: 'password123',
      };

      await request(app).post('/api/users').send(userData).expect(201);

      const response = await request(app)
        .post('/api/users')
        .send({ ...userData, username: 'johndoe2' })
        .expect(400);

      expect(response.body.error).toContain('Ya existe un usuario con este email');
    });

    it('debería retornar 400 si el username ya existe', async () => {
      const userData = {
        username: 'johndoe',
        email: 'john@example.com',
        name: 'John Doe',
        password: 'password123',
      };

      await request(app).post('/api/users').send(userData).expect(201);

      const response = await request(app)
        .post('/api/users')
        .send({ ...userData, email: 'john2@example.com' })
        .expect(400);

      expect(response.body.error).toContain('Ya existe un usuario con este username');
    });

    it('debería retornar 400 con contraseña muy corta', async () => {
      const userData = {
        username: 'johndoe',
        email: 'john@example.com',
        name: 'John Doe',
        password: '123',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.error).toContain('contraseña');
    });
  });

  describe('GET /api/users', () => {
    it('debería listar todos los usuarios activos', async () => {
      await request(app)
        .post('/api/users')
        .send({ username: 'user1', email: 'user1@example.com', name: 'User 1', password: 'password123' });

      await request(app)
        .post('/api/users')
        .send({ username: 'user2', email: 'user2@example.com', name: 'User 2', password: 'password123' });

      const response = await request(app).get('/api/users').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).not.toHaveProperty('password');
    });

    it('debería listar solo usuarios activos por defecto', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ username: 'user1', email: 'user1@example.com', name: 'User 1', password: 'password123' });

      const userId = createResponse.body.id;

      await request(app).delete(`/api/users/${userId}`);

      const response = await request(app).get('/api/users').expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/users/:id', () => {
    it('debería obtener un usuario por ID', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ username: 'johndoe', email: 'john@example.com', name: 'John Doe', password: 'password123' });

      const userId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.username).toBe('johndoe');
      expect(response.body).not.toHaveProperty('password');
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      const response = await request(app)
        .get('/api/users/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('debería actualizar un usuario exitosamente', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ username: 'johndoe', email: 'john@example.com', name: 'John Doe', password: 'password123' });

      const userId = createResponse.body.id;

      const updateData = {
        username: 'janedoe',
        email: 'jane@example.com',
        name: 'Jane Doe',
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.username).toBe(updateData.username);
      expect(response.body.email).toBe(updateData.email);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body).not.toHaveProperty('password');
    });

    it('debería actualizar un usuario incluyendo password', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ username: 'johndoe', email: 'john@example.com', name: 'John Doe', password: 'password123' });

      const userId = createResponse.body.id;

      const updateData = {
        username: 'janedoe',
        email: 'jane@example.com',
        name: 'Jane Doe',
        password: 'newpassword456',
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.username).toBe(updateData.username);
    });

    it('debería retornar 400 si el usuario no existe', async () => {
      const updateData = {
        username: 'janedoe',
        email: 'jane@example.com',
        name: 'Jane Doe',
      };

      const response = await request(app)
        .put('/api/users/non-existent-id')
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('debería retornar 400 si el nuevo email ya existe', async () => {
      await request(app)
        .post('/api/users')
        .send({ username: 'user1', email: 'user1@example.com', name: 'User 1', password: 'password123' });

      const createResponse = await request(app)
        .post('/api/users')
        .send({ username: 'user2', email: 'user2@example.com', name: 'User 2', password: 'password123' });

      const userId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send({ username: 'user2', email: 'user1@example.com', name: 'User 2' })
        .expect(400);

      expect(response.body.error).toContain('Ya existe otro usuario con este email');
    });

    it('debería retornar 400 si el nuevo username ya existe', async () => {
      await request(app)
        .post('/api/users')
        .send({ username: 'user1', email: 'user1@example.com', name: 'User 1', password: 'password123' });

      const createResponse = await request(app)
        .post('/api/users')
        .send({ username: 'user2', email: 'user2@example.com', name: 'User 2', password: 'password123' });

      const userId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send({ username: 'user1', email: 'user2@example.com', name: 'User 2' })
        .expect(400);

      expect(response.body.error).toContain('Ya existe otro usuario con este username');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('debería realizar borrado lógico de un usuario', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ username: 'johndoe', email: 'john@example.com', name: 'John Doe', password: 'password123' });

      const userId = createResponse.body.id;

      await request(app).delete(`/api/users/${userId}`).expect(200);

      const getResponse = await request(app).get(`/api/users/${userId}`);
      
      expect(getResponse.body.isActive).toBe(false);
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      const response = await request(app)
        .delete('/api/users/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Health Check', () => {
    it('debería retornar status OK', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});