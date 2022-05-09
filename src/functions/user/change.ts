import { APIGatewayEvent } from 'aws-lambda'
import { httpException } from '../../factory/httpException'
import { httpResponse } from '../../factory/httpResponse'
import UserService from '../../services/user.service'
import { User, UserChangePassword } from '../../types/user'
import { AuthenticateException } from '../../exceptions'

export const handler = async (event: APIGatewayEvent) => {
  try {
    const { newpassword, password, username }: UserChangePassword = JSON.parse(
      event.body
    )

    const currentUser: User = await UserService.findWithPassword(
      username,
      password
    )

    if (!currentUser) {
      throw new AuthenticateException('Username or password invalid.')
    }

    const user: User = await UserService.changePassword(username, password)

    return httpResponse(user, 200)
  } catch (err) {
    return httpException(err, 'Failure to change password')
  }
}
