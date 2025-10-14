import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserEntity } from '../persistence/typeorm/entities/UserEntity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true, // Solo para desarrollo, usar migraciones en producción
  logging: false,
  entities: [UserEntity],
  migrations: [],
  subscribers: [],
});

export const initializeDatabase = async (): Promise<DataSource> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Base de datos inicializada correctamente');
    return AppDataSource;
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  }
};