export class AccessForbiddenException extends Error {
  constructor(message: string) {
    super(message);
  }
}
