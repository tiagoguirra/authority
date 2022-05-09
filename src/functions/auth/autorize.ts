import { APIGatewayEvent } from 'aws-lambda'
import { httpException } from '../../factory/httpException'
import { httpResponse } from '../../factory/httpResponse'
import AuthService from '../../services/auth.service'
import { Client } from '../../types/client'
import { Token } from '../../types/jwt'

export const handler = async (event: APIGatewayEvent) => {
  try {
    const { client_id, redirect_uri } = event.queryStringParameters

    const client: Client = await AuthService.autorizeRequest(
      client_id,
      redirect_uri
    )
    return httpResponse(client, 200)
  } catch (err) {
    return httpException(err, 'Failure to get client request')
  }
}
