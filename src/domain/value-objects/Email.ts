export class Email {
  private readonly value: string;

  constructor(email: string) {
    this.value = email;
    this.validate();
  }

  private validate(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('El email es obligatorio');
    }

    if (!emailRegex.test(this.value)) {
      throw new Error('El formato del email no es válido');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }

  toString(): string {
    return this.value;
  }
}