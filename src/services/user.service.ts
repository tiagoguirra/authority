import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { User } from '../types/user'
import { DynamoDB } from './aws.service'
import { hashSync, compareSync } from 'bcrypt'
import { updateQuey } from '../utils/dynamo.utils'

class UserService {
  private hashPassword(password: string): string {
    return hashSync(password, 10)
  }
  async find(username: string): Promise<User> {
    const params: DocumentClient.GetItemInput = {
      TableName: process.env.TABLE_USER,
      Key: {
        username
      }
    }
    const { Item } = await DynamoDB.get(params).promise()

    return Item as User
  }
  async create(user: Partial<User>): Promise<User> {
    const params: DocumentClient.PutItemInput = {
      TableName: process.env.TABLE_USER,
      Item: {
        ...user,
        active: true,
        password: this.hashPassword(user.password),
        created_at: new Date().toISOString()
      }
    }
    await DynamoDB.put(params).promise()
    return this.find(user.username)
  }

  async update(username: string, user: Partial<User>): Promise<User> {
    if (user.password) {
      delete user.password
    }

    const payload = {
      ...user,
      updated_at: new Date().toISOString()
    }
    const params: DocumentClient.Update = {
      ...updateQuey(process.env.TABLE_USER, payload, ['username']),
      Key: {
        username
      }
    }
    await DynamoDB.update(params).promise()

    return this.find(username)
  }

  async findWithPassword(username: string, password: string): Promise<User> {
    const user: User = await this.find(username)

    return user && compareSync(password, user.password) ? user : null
  }

  async changePassword(username: string, password: string): Promise<User> {
    const payload = {
      password: this.hashPassword(password),
      updated_at: new Date().toISOString()
    }
    const params: DocumentClient.Update = {
      ...updateQuey(process.env.TABLE_USER, payload, ['username']),
      Key: {
        username
      }
    }

    await DynamoDB.update(params).promise()

    return this.find(username)
  }
}
export default new UserService()
