import { User } from './user'

export interface JwtCertificate {
  publicKey: string
  privateKey: string
}

export enum JwtType {
  accessToken = 'accessToken',
  refreshToken = 'refreshToken'
}

export interface JwtPayload {
  client_id: string
  user: User
  type: JwtType
  scopes
  expiresAt: Date
}

export interface AccessToken {
  access_token: string
  expires_in: number
  scope: string
}

export interface RefreshToken {
  refresh_token: string
  expires_in: number
  scope: string
}

export interface Token {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}
