import { AppSyncAuthorizerResult, AppSyncAuthorizerEvent } from 'aws-lambda'
import AuthService from '../../services/auth.service'
import { JwtPayload } from '../../types/jwt'
import PolicyService from '../../services/policy.service'
import { User } from '../../types/user'

export const handler = async (
  event: AppSyncAuthorizerEvent
): Promise<AppSyncAuthorizerResult<User>> => {
  try {
    const bearerToken = event.authorizationToken

    const decoded: JwtPayload = await AuthService.decodeValidate(bearerToken)

    if (decoded) {
      return PolicyService.graphqlPolicy(decoded.user, true)
    }
    return PolicyService.graphqlPolicy(null, false)
  } catch (err) {
    console.error('graphqlValidateError', err)
    return PolicyService.graphqlPolicy(null, false)
  }
}
