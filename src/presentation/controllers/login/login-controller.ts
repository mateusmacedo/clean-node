import { badRequest, okRequest, serverError, unauthorizedRequest } from '../../helpers/http-response-helper'
import { Authentication, Controller, HttpRequest, HttpResponse, Validation } from './login-controller-protocols'

export class LoginController implements Controller {
  constructor (private readonly authentication: Authentication, private readonly validation: Validation) {}

  async handler (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    try {
      const requestHasError = await this.validation.validate(httpRequest.body)
      if (requestHasError) {
        return badRequest(requestHasError)
      }
      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) {
        return unauthorizedRequest()
      }
      return okRequest({ accessToken })
    } catch (e) {
      return serverError(e)
    }
  }
}
