import { Client } from '../types/client'

export const mockClient: Client = {
  client_id: '123456789',
  client_secret: '123456789',
  name: 'Mocked client',
  expiration_refresh_time: 9000,
  expiration_token_time: 9000,
  created_at: '',
  redirect_uri: '/teste'
}
