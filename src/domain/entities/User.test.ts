import { User } from './User';
import { Email } from '../value-objects/Email';

describe('User Entity', () => {
  const validEmail = new Email('test@example.com');

  it('debería crear un usuario válido', () => {
    const user = new User('1', 'johndoe', validEmail, 'John Doe', 'password123');
    
    expect(user.id).toBe('1');
    expect(user.username).toBe('johndoe');
    expect(user.email).toBe(validEmail);
    expect(user.name).toBe('John Doe');
    expect(user.password).toBe('password123');
    expect(user.isActive).toBe(true);
  });

  it('debería lanzar error con username vacío', () => {
    expect(() => {
      new User('1', '', validEmail, 'John Doe', 'password123');
    }).toThrow('El username es obligatorio');
  });

  it('debería lanzar error con username muy corto', () => {
    expect(() => {
      new User('1', 'ab', validEmail, 'John Doe', 'password123');
    }).toThrow('El username debe tener entre 3 y 50 caracteres');
  });

  it('debería lanzar error con username con caracteres inválidos', () => {
    expect(() => {
      new User('1', 'john doe', validEmail, 'John Doe', 'password123');
    }).toThrow('El username solo puede contener letras, números, guiones y guiones bajos');
  });

  it('debería lanzar error con nombre vacío', () => {
    expect(() => {
      new User('1', 'johndoe', validEmail, '', 'password123');
    }).toThrow('El nombre es obligatorio');
  });

  it('debería lanzar error con nombre muy corto', () => {
    expect(() => {
      new User('1', 'johndoe', validEmail, 'A', 'password123');
    }).toThrow('El nombre debe tener entre 2 y 100 caracteres');
  });

  it('debería lanzar error con contraseña vacía', () => {
    expect(() => {
      new User('1', 'johndoe', validEmail, 'John Doe', '');
    }).toThrow('La contraseña es obligatoria');
  });

  it('debería lanzar error con contraseña muy corta', () => {
    expect(() => {
      new User('1', 'johndoe', validEmail, 'John Doe', '12345');
    }).toThrow('La contraseña debe tener al menos 6 caracteres');
  });

  it('debería actualizar un usuario sin cambiar password', () => {
    const user = new User('1', 'johndoe', validEmail, 'John Doe', 'password123');
    const newEmail = new Email('new@example.com');
    
    user.update('janedoe', newEmail, 'Jane Doe');
    
    expect(user.username).toBe('janedoe');
    expect(user.email).toBe(newEmail);
    expect(user.name).toBe('Jane Doe');
    expect(user.password).toBe('password123'); // No cambió
  });

  it('debería actualizar un usuario incluyendo password', () => {
    const user = new User('1', 'johndoe', validEmail, 'John Doe', 'password123');
    const newEmail = new Email('new@example.com');
    
    user.update('janedoe', newEmail, 'Jane Doe', 'newpassword456');
    
    expect(user.username).toBe('janedoe');
    expect(user.email).toBe(newEmail);
    expect(user.name).toBe('Jane Doe');
    expect(user.password).toBe('newpassword456');
  });

  it('debería realizar borrado lógico', () => {
    const user = new User('1', 'johndoe', validEmail, 'John Doe', 'password123');
    
    user.softDelete();
    
    expect(user.isActive).toBe(false);
  });

  it('debería activar un usuario', () => {
    const user = new User('1', 'johndoe', validEmail, 'John Doe', 'password123', false);
    
    user.activate();
    
    expect(user.isActive).toBe(true);
  });
});