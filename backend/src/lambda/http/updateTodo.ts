import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('UPDATE TODO')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const todoId = event.pathParameters.todoId
  const todo: UpdateTodoRequest = JSON.parse(event.body)

  const todoToUpdate = {
    todoId,
    ...todo
  }

  logger.info(' -----> TODO TO UPDATE >>>>> ', todoToUpdate)

  const authHeader = event.headers.Authorization
  const split = authHeader.split(' ')
  const jwt = split[1]

  const updatedItem = await updateTodo(todoToUpdate, jwt)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: updatedItem
    })
  }
}
