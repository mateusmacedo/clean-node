import { badRequest, createdRequest, serverError } from '../../helpers/http-response-helper'
import { AddAccount, Controller, HttpRequest, HttpResponse, Validation } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validation: Validation) {
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
      const account = await this.addAccount.add({ name, email, password })
      return createdRequest(account)
    } catch (e) {
      // @todo log and error control system
      return serverError(e)
    }
  }
}
