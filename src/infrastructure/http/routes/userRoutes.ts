// src/infrastructure/http/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  router.post('/users', userController.create);
  router.get('/users', userController.list);
  router.get('/users/:id', userController.getById);
  router.put('/users/:id', userController.update);
  router.delete('/users/:id', userController.delete);

  return router;
}