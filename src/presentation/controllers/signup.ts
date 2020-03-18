export class SignUpController {
  handler (httpRequest: any): any {
    let body = null
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
