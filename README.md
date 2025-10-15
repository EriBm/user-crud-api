# API REST CRUD de Usuarios

API REST completa implementada con **TypeScript**, **Express.js**, **TypeORM** y **SQLite**, siguiendo principios de **Domain-Driven Design (DDD)**, **Arquitectura Hexagonal** y **SOLID**.

## 📚 Documentación API

La documentación interactiva de la API está disponible con **Swagger UI**:

- **Local**: http://localhost:3000/api-docs
- **Producción**: https://your-app./api-docscom

## 🏗️ Arquitectura

### Capas de la Aplicación

```
src/
├── domain/                   # Capa de Dominio (Lógica de Negocio)
│   ├── entities/             # Entidades del dominio
│   ├── repositories/         # Interfaces de repositorios (Ports)
│   └── value-objects/        # Objetos de valor
├── application/              # Capa de Aplicación
│   └── use-cases/            # Casos de uso
├── infrastructure/           # Capa de Infraestructura (Adapters)
│   ├── database/             # Configuración de base de datos
│   ├── http/                 # Controladores y rutas Express
│   └── persistence/          # Implementaciones de repositorios
└── shared/                   # Código compartido
```

### Principios Aplicados

- **Domain-Driven Design (DDD)**: Separación clara del dominio del negocio
- **Arquitectura Hexagonal**: Independencia de frameworks y tecnologías
- **SOLID**:
  - **S**ingle Responsibility: Cada clase tiene una única responsabilidad
  - **O**pen/Closed: Abierto para extensión, cerrado para modificación
  - **L**iskov Substitution: Las interfaces son sustituibles
  - **I**nterface Segregation: Interfaces específicas y cohesivas
  - **D**ependency Inversion: Dependencias hacia abstracciones

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar solo tests de integración
npm run test:integration
```

## 📡 Endpoints

### Base URL
```
http://localhost:3000/api
```

### 1. Crear Usuario
```http
POST /api/users
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

**Respuesta (201):**
```json
{
  "id": "uuid-v4",
  "username": "johndoe",
  "email": "john@example.com",
  "name": "John Doe",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Listar Usuarios
```http
GET /api/users
GET /api/users?includeInactive=true
```

**Respuesta (200):**
```json
[
  {
    "id": "uuid-v4",
    "username": "johndoe",
    "email": "john@example.com",
    "name": "John Doe",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 3. Obtener Usuario por ID
```http
GET /api/users/:id
```

**Respuesta (200):**
```json
{
  "id": "uuid-v4",
  "username": "johndoe",
  "email": "john@example.com",
  "name": "John Doe",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Actualizar Usuario
```http
PUT /api/users/:id
Content-Type: application/json

{
  "username": "janedoe",
  "email": "jane@example.com",
  "name": "Jane Doe",
  "password": "newpassword456"
}
```
*Nota: el campo password es opcional*

**Respuesta (200):**
```json
{
  "id": "uuid-v4",
  "username": "janedoe",
  "email": "jane@example.com",
  "name": "Jane Doe",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 5. Borrado Lógico de Usuario
```http
DELETE /api/users/:id
```

**Respuesta (200):**
```json
{
  "message": "Usuario eliminado correctamente"
}
```

### Health Check
```http
GET /health
```

**Respuesta (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔍 Validaciones

### Usuario
- **username**: Requerido, entre 3 y 50 caracteres, solo letras, números, guiones y guiones bajos, único
- **email**: Requerido, formato válido, único
- **name**: Requerido, entre 2 y 100 caracteres
- **password**: Requerido, mínimo 6 caracteres (no se expone en las respuestas)

## ⚠️ Manejo de Errores

### Códigos de Estado
- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Error de validación o lógica de negocio
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

### Formato de Error
```json
{
  "error": "Mensaje descriptivo del error"
}
```

## 📦 Dependencias Principales

- **express**: Framework web
- **typeorm**: ORM para TypeScript
- **sqlite3**: Base de datos
- **reflect-metadata**: Soporte para decoradores
- **class-validator**: Validaciones
- **uuid**: Generación de IDs únicos

## 🧪 Cobertura de Tests

- ✅ Tests unitarios de entidades
- ✅ Tests unitarios de value objects
- ✅ Tests unitarios de casos de uso
- ✅ Tests de integración de endpoints
- ✅ Tests de validaciones
- ✅ Tests de borrado lógico

## 📝 Notas Técnicas

### Borrado Lógico
Los usuarios no se eliminan físicamente de la base de datos. Se marca el campo `isActive` como `false`. Por defecto, el endpoint `GET /api/users` solo retorna usuarios activos.

### Base de Datos
Se utiliza SQLite con el archivo `database.sqlite` en el directorio raíz.

### UUID v4
Se utiliza UUID v4 para generar IDs únicos y seguros.

## 🔄 Extensibilidad

Para agregar nuevas entidades:

1. Crear entidad en `domain/entities`
2. Crear value objects necesarios
3. Definir interfaz de repositorio en `domain/repositories`
4. Crear casos de uso en `application/use-cases`
5. Implementar repositorio en `infrastructure/persistence`
6. Crear controlador y rutas en `infrastructure/http`
7. Agregar tests unitarios e integración

## 📄 Licencia

MIT
