import { PolicyDocument } from 'aws-lambda'

export interface IotAuthorizerEvent {
  token: string
  signatureVerified: Boolean // Indicates whether the device gateway has validated the signature.
  protocols: string[]
  protocolData: {
    tls?: {
      serverName: string
    }
    http?: {
      headers: IotAuthorizerEventProperties
      queryString: string
    }
    mqtt?: IotAuthorizerEventProperties
  }
  connectionMetadata: {
    id: string
  }
}
export interface IotAuthorizerEventProperties {
  thingName: string
  thingId: string
  [key: string]: string
}

export interface IotAuthorizerResult {
  isAuthenticated: boolean
  principalId: string
  disconnectAfterInSeconds: number
  refreshAfterInSeconds: number
  policyDocuments: PolicyDocument[]
}
