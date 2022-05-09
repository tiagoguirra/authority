import { APIGatewayEvent } from 'aws-lambda'
import { httpException } from '../../factory/httpException'
import { httpResponse } from '../../factory/httpResponse'
import UserService from '../../services/user.service'
import { User } from '../../types/user'

export const handler = async (event: APIGatewayEvent) => {
  try {
    const username = event.pathParameters.username

    const body: Partial<User> = JSON.parse(event.body)

    const user: User = await UserService.update(username, body)

    return httpResponse(user, 200)
  } catch (err) {
    return httpException(err, 'Failure to update user')
  }
}
