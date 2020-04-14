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
    const { email, password } = httpRequest.body
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

    return new Promise(resolve => resolve(response))
  }
}
