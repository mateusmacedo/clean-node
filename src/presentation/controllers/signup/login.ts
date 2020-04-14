import { InvalidParamError, MissingParamError } from '../../erros'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../../protocols/email-validator'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handler (httpRequest: HttpRequest): Promise<HttpResponse> {
    let response
    if (!httpRequest.body.email) {
      response = badRequest(new MissingParamError('email'))
    }
    if (!httpRequest.body.password) {
      response = badRequest(new MissingParamError('password'))
    }
    const isValid = await this.emailValidator.isValid(httpRequest.body.email)
    if (!isValid) {
      response = badRequest(new InvalidParamError('email'))
    }
    return new Promise(resolve => resolve(response))
  }
}
