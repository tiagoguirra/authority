import CodeService from './code.service'
import ClientService from './client.service'
import UserService from './user.service'
import { Code } from '../types/code'
import { Client } from '../types/client'
import { User } from '../types/user'
import SecretService from './secret.service'
import jwt from 'jwt-simple'
import {
  AccessToken,
  RefreshToken,
  JwtType,
  Token,
  JwtPayload
} from '../types/jwt'
import { AuthenticateException, InvalidArgumentExcetion } from '../exceptions'

class AuthService {
  async autorizeRequest(
    client_id: string,
    redirect_uri: string
  ): Promise<Client> {
    const client: Client = await ClientService.find(client_id)

    if (!client || client.redirect_uri !== redirect_uri) {
      // Rise exception
      throw new InvalidArgumentExcetion('Invalid client paramters.')
    }

    return client
  }

  async autorizeApproves(
    client_id: string,
    username: string,
    scopes: string[] = []
  ): Promise<Code> {
    const code: Code = await CodeService.create(client_id, username, scopes)

    return code
  }

  async grantCode(
    auth_code: string,
    client_id: string,
    verification: string
  ): Promise<Token> {
    const code: Code = await CodeService.findWithClient(auth_code, client_id)

    if (!code) {
      // Rise exception
      throw new AuthenticateException(
        'Invalid code token or verification argument.'
      )
    }

    const client: Client = await ClientService.find(client_id)

    if (
      client &&
      (client.redirect_uri === verification ||
        client.client_secret === verification)
    ) {
      const user: User = await UserService.find(code.username)

      return this.generateTokens(user, client, code.scopes)
    }
    // Rise exception
    throw new InvalidArgumentExcetion('Invalid client paramters.')
  }

  async grantPassword(
    username: string,
    password: string,
    client_id: string,
    client_secret: string
  ): Promise<Token> {
    const client: Client = await ClientService.findWithSecret(
      client_id,
      client_secret
    )

    if (!client) {
      // Rise exception
      throw new InvalidArgumentExcetion('Invalid client paramters.')
    }

    const user: User = await UserService.findWithPassword(username, password)

    if (!user) {
      // Rise exception
      throw new AuthenticateException('Username or password invalid.')
    }

    return this.generateTokens(user, client)
  }

  async grantPasswordDefault(
    username: string,
    password: string
  ): Promise<Token> {
    const defaultClientId = await SecretService.getAuthClientDefault()
    if (!defaultClientId) {
      // Rise exception
      throw new InvalidArgumentExcetion('Invalid client paramters.')
    }

    const client: Client = await ClientService.find(defaultClientId)
    if (!client) {
      // Rise exception
      throw new InvalidArgumentExcetion('Invalid client paramters.')
    }

    const user: User = await UserService.findWithPassword(username, password)

    if (!user) {
      // Rise exception
      throw new AuthenticateException('Username or password invalid.')
    }

    return this.generateTokens(user, client)
  }

  async grantRefreshToken(
    refresh_token: string,
    client_id: string,
    client_secret: string
  ): Promise<Token> {
    const decoded: JwtPayload = await this.decodeValidate(refresh_token)

    if (
      decoded.type !== JwtType.refreshToken ||
      decoded.client_id !== client_id
    ) {
      // Rise exception
      throw new InvalidArgumentExcetion('Invalid client paramters.')
    }

    const client: Client = await ClientService.findWithSecret(
      client_id,
      client_secret
    )

    if (!client) {
      // Rise Execption
      throw new InvalidArgumentExcetion('Invalid client paramters.')
    }

    return this.generateTokens(decoded.user, client, decoded.scopes)
  }

  async generateTokens(
    user: User,
    client: Client,
    scopes: string[] = []
  ): Promise<Token> {
    const accessToken: AccessToken = await this.generateAccessToken(
      user,
      client.client_id,
      client.expiration_token_time || null,
      scopes
    )
    const refrashToken: RefreshToken = await this.generateRefreshToken(
      user,
      client.client_id,
      client.expiration_refresh_time || null,
      scopes
    )

    return {
      access_token: accessToken.access_token,
      refresh_token: refrashToken.refresh_token,
      expires_in: accessToken.expires_in,
      scope: accessToken.scope,
      token_type: 'Bearer'
    }
  }

  async generateAccessToken(
    user: User,
    client_id: string,
    expirationTime: number,
    scopes: string[] = []
  ): Promise<AccessToken> {
    let expiresAt = null
    if (expirationTime) {
      expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + expirationTime)
    }

    const certificate = await SecretService.getJwtCertificate()
    const payload: JwtPayload = {
      user,
      client_id,
      type: JwtType.accessToken,
      scopes,
      expiresAt
    }

    const token = jwt.encode(payload, certificate.privateKey, 'HS256')

    return {
      access_token: token,
      expires_in: expirationTime,
      scope: scopes.join(',')
    }
  }

  async generateRefreshToken(
    user: User,
    client_id: string,
    expirationTime: number,
    scopes: string[] = []
  ): Promise<RefreshToken> {
    let expiresAt = null
    if (expirationTime) {
      expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + expirationTime)
    }
    const certificate = await SecretService.getJwtCertificate()
    const payload: JwtPayload = {
      client_id,
      user,
      type: JwtType.refreshToken,
      scopes,
      expiresAt
    }

    const token = jwt.encode(payload, certificate.privateKey, 'HS256')
    return {
      refresh_token: token,
      expires_in: expirationTime,
      scope: scopes.join(',')
    }
  }

  async decodeValidate(bearerToken: string): Promise<JwtPayload> {
    if (!bearerToken) {
      // Rise exception
      throw new AuthenticateException('Authorization token invalid.')
    }

    bearerToken = bearerToken.trim()

    if (bearerToken.startsWith('Bearer')) {
      bearerToken = bearerToken.replace('Bearer', '')
      bearerToken = bearerToken.trim()
    }
    const certificate = await SecretService.getJwtCertificate()

    const decoded: JwtPayload = jwt.decode(
      bearerToken,
      certificate.privateKey,
      false,
      'HS256'
    )

    if (decoded?.expiresAt) {
      const now = new Date().getTime()
      const expireTime = new Date(decoded.expiresAt).getTime()

      if (expireTime > now) {
        // Rise exception
        throw new AuthenticateException('Authorization token expired.')
      }
      return decoded
    }
    return decoded
  }
}

export default new AuthService()
