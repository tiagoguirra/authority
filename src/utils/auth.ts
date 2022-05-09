import {
  APIGatewayEvent,
  AppSyncResolverEvent,
  AppSyncIdentityLambda
} from 'aws-lambda'
import { JwtPayload } from '../types/jwt'
import { User } from '../types/user'

export const getApiUser = (event: APIGatewayEvent): User => {
  const requestContext = event.requestContext
  const auth: JwtPayload =
    requestContext?.authorizer?.claims || requestContext?.authorizer

  return auth?.user
}

export const getGraphqlUser = (event: AppSyncResolverEvent<any>): User => {
  const identity = event.identity

  const auth: JwtPayload = (identity as AppSyncIdentityLambda)
    ?.resolverContext as JwtPayload

  return auth?.user
}
