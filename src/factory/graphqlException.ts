import {
  AlreadyExistException,
  AuthenticateException,
  Exception,
  InvalidArgumentExcetion,
  InvalidGrantTypeException,
  NotFoundException,
  ValidationException
} from '../exceptions'
import { GraphqlError } from '../types/resolver'

export const graphqlException = (
  error: Exception,
  message: string
): GraphqlError => {
  switch (error.constructor) {
    case InvalidArgumentExcetion:
      return {
        errorType: 'InvalidParameter',
        errorMessage: error.message || message
      }

    case AlreadyExistException:
      return {
        errorType: 'AlreadyExist',
        errorMessage: error.message || message
      }

    case NotFoundException:
      return {
        errorType: 'NotFound',
        errorMessage: error.message || message
      }
    case AuthenticateException:
      return {
        errorType: 'AccessDenied',
        errorMessage: error.message || message
      }
    case ValidationException:
      return {
        errorType: 'ValidationError',
        errorMessage: error.message || message
      }
    case InvalidGrantTypeException:
      return {
        errorType: 'InvalidGrantType',
        errorMessage: error.message || message
      }
    default:
      return {
        errorType: 'InternalError',
        errorMessage: `${
          error.message || message
        }, internal server error - read application log for more details. `
      }
  }
}
