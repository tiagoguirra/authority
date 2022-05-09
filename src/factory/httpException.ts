import {
  AlreadyExistException,
  AuthenticateException,
  Exception,
  InvalidArgumentExcetion,
  InvalidGrantTypeException,
  NotFoundException,
  ValidationException
} from '../exceptions'
import { httpResponse } from './httpResponse'

export const httpException = (error: Exception, message: string = '') => {
  switch (error.constructor) {
    case InvalidArgumentExcetion:
      return httpResponse(
        {
          error: 'InvalidParameter',
          errorMessage: error.message || message
        },
        400
      )
    case AlreadyExistException:
      return httpResponse(
        {
          error: 'AlreadyExist',
          errorMessage: error.message || message
        },
        400
      )

    case NotFoundException:
      return httpResponse(
        {
          error: 'NotFound',
          errorMessage: error.message || message
        },
        404
      )
    case AuthenticateException:
      return httpResponse(
        {
          error: 'AccessDenied',
          errorMessage: error.message || message
        },
        401
      )
    case ValidationException:
      return httpResponse(
        {
          error: 'ValidationError',
          errorMessage: error.message || message
        },
        400
      )
    case InvalidGrantTypeException:
      return httpResponse(
        {
          error: 'InvalidGrantType',
          errorMessage: error.message || message
        },
        401
      )
    default:
      return httpResponse(
        {
          error: 'InternalError',
          errorMessage: `${
            error.message || message
          }, internal server error - read application log for more details. `
        },
        400
      )
  }
}
