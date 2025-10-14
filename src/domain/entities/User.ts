import { Email } from '../value-objects/Email';

export class User {
  constructor(
    public readonly id: string,
    public username: string,
    public email: Email,
    public name: string,
    public password: string,
    public isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.username || this.username.trim().length === 0) {
      throw new Error('El username es obligatorio');
    }

    if (this.username.length < 3 || this.username.length > 50) {
      throw new Error('El username debe tener entre 3 y 50 caracteres');
    }

    // Username solo puede contener letras, números, guiones y guiones bajos
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(this.username)) {
      throw new Error('El username solo puede contener letras, números, guiones y guiones bajos');
    }

    if (!this.name || this.name.trim().length === 0) {
      throw new Error('El nombre es obligatorio');
    }

    if (this.name.length < 2 || this.name.length > 100) {
      throw new Error('El nombre debe tener entre 2 y 100 caracteres');
    }

    if (!this.password || this.password.trim().length === 0) {
      throw new Error('La contraseña es obligatoria');
    }

    if (this.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
  }

  update(username: string, email: Email, name: string, password?: string): void {
    this.username = username;
    this.email = email;
    this.name = name;
    
    if (password) {
      this.password = password;
    }
    
    this.updatedAt = new Date();
    this.validate();
  }

  softDelete(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }
}