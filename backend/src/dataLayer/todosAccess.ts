import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../types/TodoItem'
import { User } from '../types/User'
import { TodoUpdate } from '../types/TodoUpdate'

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX) {
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()
    return todo
  }

  async getTodos(user: User): Promise<TodoItem[]> {
    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.userIdIndex,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId":user.userId
      }
    }).promise()
    const todos = result.Items ? result.Items : []
    return todos as TodoItem[]
  }

  async updateTodo(todo: TodoUpdate): Promise<TodoItem> {
    await this.docClient.update({
      TableName: this.todosTable,
      Key:{
        todoId: todo.todoId
      },
      ExpressionAttributeNames: { "#N": "name" },
      UpdateExpression: "set #N = :todoName, dueDate = :dueDate, done = :done",
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { 
        ":todoName": todo.name,
        ":dueDate": todo.dueDate,
        ":done": todo.done,
        ":userId": todo.userId
      },
      ReturnValues:"UPDATED_NEW"
    }).promise()
    return todo as TodoItem
  }

  async deleteTodo(todo): Promise<TodoItem> {
    await this.docClient.delete({
      TableName: this.todosTable,
      Key:{
        todoId: todo.todoId
      },
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues:{
        ":userId" : todo.userId
      }
    }).promise()
    return todo
  }

}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('-----> CREATING A LOCAL DYNAMODB INSTANCE >>>>> ')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }
  return new XAWS.DynamoDB.DocumentClient()
}