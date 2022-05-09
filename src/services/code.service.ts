import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Code } from '../types/code'
import { DynamoDB } from './aws.service'
import { v4 as uuidv4 } from 'uuid'

class CodeService {
  async find(code: string): Promise<Code> {
    const params: DocumentClient.GetItemInput = {
      TableName: process.env.TABLE_CODE,
      Key: {
        code
      }
    }
    const { Item } = await DynamoDB.get(params).promise()

    return Item as Code
  }

  async findWithClient(code: string, client_id: string): Promise<Code> {
    const _code = await this.find(code)

    if (_code && _code.client_id === client_id) {
      return _code
    }

    return null
  }

  async create(client_id: string, username: string, scopes: string[] = []) {
    const code = uuidv4()
    const params: DocumentClient.PutItemInput = {
      TableName: process.env.TABLE_CODE,
      Item: {
        code,
        client_id,
        expires_in: Number(process.env.EXPIRE_TIME || 3060),
        scopes,
        username,
        created_at: new Date().toISOString()
      }
    }
    await DynamoDB.put(params).promise()

    return this.find(code)
  }
}

export default new CodeService()
