import * as AWS from 'aws-sdk'

if (
  process.env.IS_LOCAL ||
  process.env.IS_OFFLINE ||
  process.env.NODE_ENV === 'test'
) {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({
    profile: process.env.PROFILE
  })
}

const DynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION
})

const SecretsManager = new AWS.SecretsManager({
  region: process.env.REGION
})

export { DynamoDB, SecretsManager }
