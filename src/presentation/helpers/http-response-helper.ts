import { ServerError, UnauthorizedError } from '../erros'
import { HttpResponse } from '../protocols'

export const createdRequest = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})

export const okRequest = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: { error: error.message }
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: { error: error.message }
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const unauthorizedRequest = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})
