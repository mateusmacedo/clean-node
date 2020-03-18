import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../erros/missing-param-error'

export class SignUpController {
  handler (httpRequest: HttpRequest): HttpResponse {
    let body
    if (!httpRequest.body.name) {
      body = new MissingParamError('name')
    } else {
      body = new MissingParamError('email')
    }
    return {
      statusCode: 400,
      body: body
    }
  }
}
