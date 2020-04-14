import { MissingParamError } from '../../erros'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handler (httpRequest: HttpRequest): Promise<HttpResponse> {
    const response = badRequest(new MissingParamError('email'))
    return new Promise(resolve => resolve(response))
  }
}
