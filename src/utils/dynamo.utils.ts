import { DocumentClient } from 'aws-sdk/clients/dynamodb'

export const updateQuey = (
  tableName: string,
  properties: any,
  keyUpdate: string[]
): DocumentClient.Update => {
  let atributesNames = {}
  let attributesValues = {}

  const keys = keyUpdate.reduce((_keys, key) => {
    if (properties[key] !== undefined) {
      _keys[key] = properties[key]
      delete properties[key]
    }
    return _keys
  }, {})

  const updateFields = Object.keys(properties).map((key) => {
    const field = `#${key}`
    const value = `:${key}`

    atributesNames[field] = key
    attributesValues[value] = properties[key]

    return ` ${field} = ${value} `
  })

  return {
    TableName: tableName,
    Key: keys,
    UpdateExpression: `SET ${updateFields.join(',')}`,
    ExpressionAttributeNames: atributesNames,
    ExpressionAttributeValues: attributesValues
  }
}
