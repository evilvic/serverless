import * as uuid from 'uuid'

import { TodoItem } from '../types/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwt: string
): Promise<TodoItem> {

  const userId = parseUserId(jwt)
  const itemId = uuid.v4()

  return await todoAccess.createTodo({
    userId: userId,
    todoId: itemId,
    createdAt: new Date().toISOString(),
    done: false,
    ...createTodoRequest
  })

}

export  async function getTodos(
  jwt: string
): Promise<TodoItem[]> {

  const userId = parseUserId(jwt)
  return await todoAccess.getTodos({ userId })
  
}

export async function updateTodo(
  todo, 
  jwt: string): Promise<TodoItem> {
  
  const userId = parseUserId(jwt)
  return await todoAccess.updateTodo({ userId, ...todo })

}