import { APIGatewayEvent } from 'aws-lambda'
import { httpException } from '../../factory/httpException'
import { Token } from '../../types/jwt'
import AuthService from '../../services/auth.service'
import { httpResponse } from '../../factory/httpResponse'
import { InvalidGrantTypeException } from '../../exceptions'

interface AuthenticateBody {
  client_id: string
  client_secret?: string
  username?: string
  password?: string
  scope?: string[]
  grant_type: string
  refresh_token?: string
  code?: string
  redirect_uri?: string
}

const authenticate = (credentials: AuthenticateBody): Promise<Token> => {
  switch (credentials.grant_type) {
    case 'authorization_code':
      return AuthService.grantCode(
        credentials.code,
        credentials.client_id,
        credentials.redirect_uri || credentials.client_secret
      )
    case 'password':
      return AuthService.grantPassword(
        credentials.username,
        credentials.password,
        credentials.client_id,
        credentials.client_secret
      )
    case 'refresh_token':
      return AuthService.grantRefreshToken(
        credentials.refresh_token,
        credentials.client_id,
        credentials.client_secret
      )
    default:
      throw new InvalidGrantTypeException()
  }
}

export const handler = async (event: APIGatewayEvent) => {
  try {
    const {
      client_id,
      client_secret,
      username = null,
      password = null,
      scope = [],
      grant_type,
      refresh_token = null,
      code = null,
      redirect_uri = null
    }: AuthenticateBody = JSON.parse(event.body)

    const token: Token = await authenticate({
      client_id,
      client_secret,
      username,
      password,
      scope,
      grant_type,
      refresh_token,
      code,
      redirect_uri
    })

    return httpResponse(token, 200)
  } catch (err) {
    return httpException(err, 'Failure to approves autentication')
  }
}
