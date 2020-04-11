import { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse } from './signup-protocols'
import { badRequest, createdRequest, serverError } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../erros'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handler (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      const emailIsValid = this.emailValidator.isValid(email)
      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return createdRequest(account)
    } catch (e) {
      // @todo log and error control system
      return serverError(e.stack)
    }
  }
}
