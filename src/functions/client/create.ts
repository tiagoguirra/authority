import { APIGatewayEvent } from 'aws-lambda'
import { httpException } from '../../factory/httpException'
import { httpResponse } from '../../factory/httpResponse'
import ClientService from '../../services/client.service'
import { Client } from '../../types/client'

export const handler = async (event: APIGatewayEvent) => {
  try {
    const body: Partial<Client> = JSON.parse(event.body)

    const client: Client = await ClientService.create(body)
    return httpResponse(client, 201)
  } catch (err) {
    return httpException(err, 'Failure to create client')
  }
}
