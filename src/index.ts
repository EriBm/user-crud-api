import 'reflect-metadata';
import { AppDataSource, initializeDatabase } from './infrastructure/database/data-source';
import { UserEntity } from './infrastructure/persistence/typeorm/entities/UserEntity';
import { TypeORMUserRepository } from './infrastructure/persistence/typeorm/repositories/TypeORMUserRepository';
import { CreateUserUseCase } from './application/use-cases/CreateUser';
import { GetUserByIdUseCase } from './application/use-cases/GetUserById';
import { ListUsersUseCase } from './application/use-cases/ListUsers';
import { UpdateUserUseCase } from './application/use-cases/UpdateUser';
import { DeleteUserUseCase } from './application/use-cases/DeleteUser';
import { UserController } from './infrastructure/http/controllers/UserController';
import { createUserRoutes } from './infrastructure/http/routes/userRoutes';
import { createApp } from './infrastructure/http/app';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    // Initialize database
    await initializeDatabase();

    // Create repository
    const userRepository = new TypeORMUserRepository(
      AppDataSource.getRepository(UserEntity)
    );

    // Create use cases
    const createUserUseCase = new CreateUserUseCase(userRepository);
    const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
    const listUsersUseCase = new ListUsersUseCase(userRepository);
    const updateUserUseCase = new UpdateUserUseCase(userRepository);
    const deleteUserUseCase = new DeleteUserUseCase(userRepository);

    // Create controller
    const userController = new UserController(
      createUserUseCase,
      getUserByIdUseCase,
      listUsersUseCase,
      updateUserUseCase,
      deleteUserUseCase
    );

    // Create routes
    const routes = createUserRoutes(userController);

    // Create and start app
    const app = createApp(routes);

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📝 API Base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();