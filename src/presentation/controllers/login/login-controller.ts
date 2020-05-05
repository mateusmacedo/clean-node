import { UnauthorizedError } from '../../erros'
import { badRequest, okRequest, serverError } from '../../helpers/http-response-helper'
import { Authentication, Controller, HttpRequest, HttpResponse, Validation } from './login--controller-protocols'

export class LoginController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (authentication: Authentication, validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handler (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    try {
      const requestHasError = await this.validation.validate(httpRequest.body)
      if (requestHasError) {
        return badRequest(requestHasError)
      }
      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) {
        return badRequest(new UnauthorizedError())
      }
      return okRequest(accessToken)
    } catch (e) {
      return serverError(e)
    }
  }
}
