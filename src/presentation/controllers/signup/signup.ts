import { InvalidParamError } from '../../erros'
import { badRequest, createdRequest, serverError } from '../../helpers/http-helper'
import {
  AddAccount,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  Validation
} from './signup-protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handler (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requestHasError = await this.validation.validate(httpRequest.body)
      if (requestHasError) {
        return badRequest(requestHasError)
      }
      const { name, email, password } = httpRequest.body
      const emailIsValid = await this.emailValidator.isValid(email)
      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return createdRequest(account)
    } catch (e) {
      // @todo log and error control system
      return serverError(e)
    }
  }
}
