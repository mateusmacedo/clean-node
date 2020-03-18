import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController {
  handler (httpRequest: HttpRequest): HttpResponse {
    let body
    if (!httpRequest.body.name) {
      body = new Error('Missing param: name')
    } else {
      body = new Error('Missing param: email')
    }
    return {
      statusCode: 400,
      body: body
    }
  }
}
