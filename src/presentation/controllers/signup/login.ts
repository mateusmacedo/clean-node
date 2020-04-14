import { Authentication } from '../../../domain/usercases/authentication'
import { InvalidParamError, MissingParamError } from '../../erros'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../../protocols/email-validator'

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
      if (!email) {
        response = badRequest(new MissingParamError('email'))
      }
      const emailIsValid = await this.emailValidator.isValid(email)
      if (!emailIsValid) {
        response = badRequest(new InvalidParamError('email'))
      }
      if (!password) {
        response = badRequest(new MissingParamError('password'))
      }
      await this.authentication.auth(email, password)
      return new Promise(resolve => resolve(response))
    } catch (e) {
      response = serverError(e)
      return new Promise(resolve => resolve(response))
    }
  }
}
