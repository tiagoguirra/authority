import {
  PolicyDocument,
  APIGatewayAuthorizerResult,
  AppSyncAuthorizerResult
} from 'aws-lambda'
import { IotAuthorizerResult } from '../types/iot'
import { User } from '../types/user'

export class PolicyService {
  apiPolicy(
    user: User,
    effect: string,
    resource: string
  ): APIGatewayAuthorizerResult {
    const policy: PolicyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource.split('/').shift() + '/*'
        }
      ]
    }
    return {
      context: {
        ...user
      },
      policyDocument: policy,
      principalId: process.env.ACCOUNT_ID
    }
  }

  graphqlPolicy(
    user: User,
    isAuthorized: boolean,
    deniedFields: string[] = [],
    ttlOverride: number = 0
  ): AppSyncAuthorizerResult<User> {
    return {
      isAuthorized,
      resolverContext: user,
      deniedFields,
      ttlOverride
    }
  }
  iotPolicy(
    thingName: string,
    isAuthenticated: boolean,
    effect: string
  ): IotAuthorizerResult {
    const resourcePrefix = `arn:aws:iot:sa-east-1:${process.env.ACCOUNT_ID}`
    const shadowTopicPrefix = `$aws/things/${thingName}/shadow`

    return {
      isAuthenticated,
      principalId: process.env.ACCOUNT_ID,
      disconnectAfterInSeconds: 86400,
      refreshAfterInSeconds: 300,
      policyDocuments: [
        {
          Version: '2012-10-17',
          Statement: [
            {
              Action: ['iot:Publish', 'iot:Subscribe'],
              Effect: effect,
              Resource: [
                `${resourcePrefix}:topic/${thingName}/diagnostic`,
                `${resourcePrefix}:topicfilter/${thingName}`,
                `${resourcePrefix}:topicfilter/${thingName}/*`,
                `${resourcePrefix}:topic/${shadowTopicPrefix}/delete/*`,
                `${resourcePrefix}:topic/${shadowTopicPrefix}/get/*`,
                `${resourcePrefix}:topic/${shadowTopicPrefix}/update/*`
              ]
            }
          ]
        }
      ]
    }
  }
}

export default new PolicyService()
