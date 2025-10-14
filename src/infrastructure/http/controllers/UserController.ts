import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUser';
import { GetUserByIdUseCase } from '../../../application/use-cases/GetUserById';
import { ListUsersUseCase } from '../../../application/use-cases/ListUsers';
import { UpdateUserUseCase } from '../../../application/use-cases/UpdateUser';
import { DeleteUserUseCase } from '../../../application/use-cases/DeleteUser';

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {
    // Bind methods to preserve 'this' context
    this.create = this.create.bind(this);
    this.getById = this.getById.bind(this);
    this.list = this.list.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, name, password } = req.body;

      if (!username || !email || !name || !password) {
        res.status(400).json({
          error: 'Los campos username, email, name y password son obligatorios'
        });
        return;
      }

      const user = await this.createUserUseCase.execute({ username, email, name, password });

      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email.getValue(),
        name: user.name,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getUserByIdUseCase.execute(id);

      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email.getValue(),
        name: user.name,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const users = await this.listUsersUseCase.execute(includeInactive);

      res.status(200).json(
        users.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email.getValue(),
          name: user.name,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }))
      );
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { username, email, name, password } = req.body;

      if (!username || !email || !name) {
        res.status(400).json({
          error: 'Los campos username, email y name son obligatorios'
        });
        return;
      }

      const user = await this.updateUserUseCase.execute({ 
        id, 
        username, 
        email, 
        name, 
        password 
      });

      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email.getValue(),
        name: user.name,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteUserUseCase.execute(id);

      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }
}