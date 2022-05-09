import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Client } from '../types/client'
import { DynamoDB } from './aws.service'
import { v4 as uuidv4 } from 'uuid'
import { hashSync } from 'bcrypt'
import { updateQuey } from '../utils/dynamo.utils'

class ClientService {
  get expireDays(): number {
    return Number(process.env.EXPIRE_DAYS || 7) || 7
  }

  get expireDaysRefresh(): number {
    return Number(process.env.EXPIRE_DAYS_REFRESH || 7) || 7
  }

  private hashSecret(secret: string): string {
    return hashSync(secret, 10)
  }

  async findWithSecret(
    client_id: string,
    client_secret: string
  ): Promise<Client> {
    const client = await this.find(client_id)

    if (client && client.client_secret === client_secret) {
      return client
    }
    return null
  }
  async find(client_id: string): Promise<Client> {
    const params: DocumentClient.GetItemInput = {
      TableName: process.env.TABLE_CLIENT,
      Key: {
        client_id
      }
    }
    const { Item } = await DynamoDB.get(params).promise()

    return Item as Client
  }

  async create(client: Partial<Client>): Promise<Client> {
    const client_id = uuidv4()
    const params: DocumentClient.PutItemInput = {
      TableName: process.env.TABLE_CLIENT,
      Item: {
        ...client,
        client_id,
        expiration_token_time: client.expiration_token_time || this.expireDays,
        expiration_refresh_time:
          client.expiration_refresh_time || this.expireDaysRefresh,
        client_secret: this.hashSecret(uuidv4()),
        created_at: new Date().toISOString()
      }
    }
    await DynamoDB.put(params).promise()
    return this.find(client_id)
  }

  async update(client_id: string, client: Partial<Client>): Promise<Client> {
    const _client = await this.find(client_id)

    const payload: Partial<Client> = {
      avatar: client.avatar || _client.avatar || null,
      description: client.description || _client.description || null,
      homepage: client.homepage || _client.homepage || null,
      name: client.name || _client.name,
      redirect_uri: client.redirect_uri || _client.redirect_uri,
      updated_at: new Date().toISOString()
    }
    const params: DocumentClient.Update = {
      ...updateQuey(process.env.TABLE_CLIENT, payload, ['client_id']),
      Key: {
        client_id
      }
    }
    await DynamoDB.update(params).promise()

    return this.find(client_id)
  }
}

export default new ClientService()
