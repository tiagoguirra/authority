import authService from './auth.service'
import SecretService from './secret.service'
import CodeService from './code.service'
import ClientService from './client.service'
import UserService from './user.service'
import { InvalidArgumentExcetion } from '../exceptions'
import { mockClient } from '../MOCK/client'
import { mockCode } from '../MOCK/code'
import { mockCertificate, mockSecret } from '../MOCK/secret'
import { mockUser } from '../MOCK/user'

describe('AuthService suit test', () => {
  beforeEach(() => {
    jest.spyOn(ClientService, 'find').mockResolvedValue(mockClient)
    jest.spyOn(CodeService, 'findWithClient').mockResolvedValue(mockCode)
    jest
      .spyOn(SecretService, 'getJwtCertificate')
      .mockResolvedValue(mockCertificate)
    jest.spyOn(UserService, 'find').mockResolvedValue(mockUser)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('Authorize Request', async () => {
    expect.assertions(1)

    const client = await authService.autorizeRequest('123456789', '/teste')

    expect(client).toEqual(expect.objectContaining(mockClient))
  })

  it('Grant code', async () => {
    expect.assertions(2)
    const response = await authService.grantCode(
      '123',
      '123456789',
      '123456789'
    )
    expect(response).toHaveProperty('access_token')
    expect(response).toHaveProperty('token_type')
  })

  it('Grant code', async () => {
    expect.assertions(2)
    const response = await authService.grantCode(
      '123',
      '123456789',
      '123456789'
    )
    expect(response).toHaveProperty('access_token')
    expect(response).toHaveProperty('token_type')
  })
})
