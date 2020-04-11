import { LogControllerDecorator } from '../../../src/main/decorators/log-controller-decorator'
import { Controller, HttpRequest, HttpResponse } from '../../../src/presentation/protocols'

describe('Log Decorator', () => {
  test('Should call controller handle with correct values', async () => {
    class ControllerStub implements Controller {
      async handler (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {
            id: 'any_value',
            name: 'any_value',
            email: 'any_value@mail.com,',
            password: 'any_value'
          }
        }
        return new Promise(resolve => resolve(httpResponse))
      }
    }

    const controllerStub = new ControllerStub()
    const sut = new LogControllerDecorator(controllerStub)
    const handleSpy = jest.spyOn(controllerStub, 'handler')
    const httpRequest = {
      body: {
        name: 'any_value',
        email: 'any_value@mail.com,',
        password: 'any_value',
        passwordConfirmation: 'any_value'
      }
    }
    await sut.handler(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
