import { APIGatewayEvent } from 'aws-lambda'
import { httpException } from '../../factory/httpException'
import { Code } from '../../types/code'
import { User } from '../../types/user'
import { getApiUser } from '../../utils/auth'
import AuthService from '../../services/auth.service'
import { httpResponse } from '../../factory/httpResponse'

export const handler = async (event: APIGatewayEvent) => {
  try {
    const { client_id, scopes = [], redirect_uri } = JSON.parse(event.body)
    const user: User = getApiUser(event)

    const code: Code = await AuthService.autorizeApproves(
      client_id,
      user.username,
      scopes
    )
    return httpResponse(code, 201)
  } catch (err) {
    return httpException(err, 'Failure to approves autentication')
  }
}
