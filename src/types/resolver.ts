export interface AutorizeRequest {
  client_id: string
  redirect_uri: string
}

export interface AutorizeApprove {
  client_id: string
  username: string
  scopes: string[]
}

export interface GrantCode {
  auth_code: string
  client_id: string
  verification: string
}

export interface GrantPassword {
  username: string
  password: string
  client_id?: string
  client_secret?: string
}

export interface GraphqlError {
  errorType: string
  errorMessage: string
}
