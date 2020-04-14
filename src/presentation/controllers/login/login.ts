import { InvalidParamError, MissingParamError, UnauthorizedError } from '../../erros'
import { badRequest, serverError } from '../../helpers/http-helper'
import {
  Authentication,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from './login-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handler (httpRequest: HttpRequest): Promise<HttpResponse> {
    let response
    const { email, password } = httpRequest.body
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const emailIsValid = await this.emailValidator.isValid(email)
      if (!emailIsValid) {
        response = badRequest(new InvalidParamError('email'))
      }
      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        response = badRequest(new UnauthorizedError())
      }
      return response
    } catch (e) {
      return serverError(e)
    }
  }
}
