// src/infrastructure/persistence/typeorm/entities/UserEntity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ unique: true, length: 50 })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ length: 100 })
  name!: string;

  @Column()
  password!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}