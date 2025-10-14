// src/infrastructure/http/swagger/swagger.config.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Users API - CRUD',
      version: '1.0.0',
      description: 'API REST para gestión de usuarios implementada con DDD, Arquitectura Hexagonal y principios SOLID',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://your-app.vercel.app',
        description: 'Servidor de producción',
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'Operaciones CRUD de usuarios',
      },
      {
        name: 'Health',
        description: 'Estado del servidor',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único del usuario',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 50,
              description: 'Nombre de usuario único',
              example: 'johndoe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico único',
              example: 'john@example.com',
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Nombre completo del usuario',
              example: 'John Doe',
            },
            isActive: {
              type: 'boolean',
              description: 'Estado del usuario (activo/inactivo)',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
              example: '2024-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        CreateUserRequest: {
          type: 'object',
          required: ['username', 'email', 'name', 'password'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 50,
              description: 'Nombre de usuario (solo letras, números, guiones y guiones bajos)',
              example: 'johndoe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico',
              example: 'john@example.com',
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Nombre completo',
              example: 'John Doe',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Contraseña (mínimo 6 caracteres)',
              example: 'password123',
            },
          },
        },
        UpdateUserRequest: {
          type: 'object',
          required: ['username', 'email', 'name'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 50,
              description: 'Nombre de usuario',
              example: 'janedoe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico',
              example: 'jane@example.com',
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Nombre completo',
              example: 'Jane Doe',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Nueva contraseña (opcional)',
              example: 'newpassword456',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error',
              example: 'Usuario no encontrado',
            },
          },
        },
        SuccessMessage: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de éxito',
              example: 'Usuario eliminado correctamente',
            },
          },
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
      },
    },
  },
  apis: ['./src/infrastructure/http/swagger/*.docs.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);