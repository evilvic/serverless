import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('CREATE TODO')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(' -----> START TODO CREATION >>>>> ', event)

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  // TODO: Authorization

  try {
    const newItem = await createTodo(newTodo)
    logger.info(' { ^ _ ^ } SUCCES: TODO CREATED >>>>> ', newItem)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  } catch (error) {
    logger.info(' { X _ X } ERROR: TODO CREATION FAILED >>>>> ', error)
    return {
      statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Error on creating Todo.'
    })
    }
  }

}
