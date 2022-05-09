export interface Client {
  client_id: string
  client_secret: string
  avatar?: string
  name: string
  homepage?: string
  description?: string
  redirect_uri?: string
  created_at: string
  updated_at?: string
  expiration_token_time: number
  expiration_refresh_time: number
}
