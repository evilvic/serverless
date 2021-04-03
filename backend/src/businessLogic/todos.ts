import * as uuid from 'uuid'

import { TodoItem } from '../types/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoAcces = new TodoAccess()

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwt: string
): Promise<TodoItem> {

  const userId = parseUserId(jwt)
  const itemId = uuid.v4()

  return await todoAcces.createTodo({
    userId: userId,
    todoId: itemId,
    createdAt: new Date().toISOString(),
    done: false,
    ...createTodoRequest
  })

}