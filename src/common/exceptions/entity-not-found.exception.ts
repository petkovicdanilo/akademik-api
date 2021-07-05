export class EntityNotFoundException<T> extends Error {
  constructor(tCtor: new (...args: any[]) => T, message?: string) {
    super(`${message ?? tCtor.name} not found`);
  }
}
