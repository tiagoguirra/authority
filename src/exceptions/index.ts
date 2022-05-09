export class AuthenticateException extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class InvalidArgumentExcetion extends Error {
  constructor(massage: string) {
    super(massage)
  }
}

export class NotFoundException extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class AlreadyExistException extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class ValidationException extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class InvalidGrantTypeException extends Error {
  constructor() {
    super('Invalid grant type')
  }
}

export type Exception =
  | AuthenticateException
  | InvalidArgumentExcetion
  | NotFoundException
  | AlreadyExistException
  | ValidationException
  | InvalidGrantTypeException
  | Error
