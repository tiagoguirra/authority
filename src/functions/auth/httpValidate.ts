import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent
} from 'aws-lambda'
import AuthService from '../../services/auth.service'
import { JwtPayload } from '../../types/jwt'
import PolicyService from '../../services/policy.service'

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  try {
    const bearerToken = event.authorizationToken

    const decoded: JwtPayload = await AuthService.decodeValidate(bearerToken)

    if (decoded) {
      return PolicyService.apiPolicy(decoded.user, 'Allow', event.methodArn)
    }
    return PolicyService.apiPolicy(null, 'Deny', event.methodArn)
  } catch (err) {
    console.error('httpValidateError', err)
    return PolicyService.apiPolicy(null, 'Deny', event.methodArn)
  }
}
