import { MissingParamError } from '../../erros'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handler (httpRequest: HttpRequest): Promise<HttpResponse> {
    let response
    if (!httpRequest.body.email) {
      response = badRequest(new MissingParamError('email'))
    }
    if (!httpRequest.body.password) {
      response = badRequest(new MissingParamError('password'))
    }

    return new Promise(resolve => resolve(response))
  }
}
