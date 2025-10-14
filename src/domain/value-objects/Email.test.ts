import { Email } from './Email';

describe('Email Value Object', () => {
  it('debería crear un email válido', () => {
    const email = new Email('test@example.com');
    
    expect(email.getValue()).toBe('test@example.com');
  });

  it('debería lanzar error con email vacío', () => {
    expect(() => {
      new Email('');
    }).toThrow('El email es obligatorio');
  });

  it('debería lanzar error con formato inválido', () => {
    expect(() => {
      new Email('invalid-email');
    }).toThrow('El formato del email no es válido');
  });

  it('debería comparar emails correctamente', () => {
    const email1 = new Email('test@example.com');
    const email2 = new Email('TEST@EXAMPLE.COM');
    const email3 = new Email('other@example.com');
    
    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });
});