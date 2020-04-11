import { LogControllerDecorator } from '../../../src/main/decorators/log-controller-decorator'
import { Controller, HttpRequest, HttpResponse } from '../../../src/presentation/protocols'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeController = (): Controller => {
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

  return new ControllerStub()
}
const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logControllerDecorator = new LogControllerDecorator(controllerStub)
  return { sut: logControllerDecorator, controllerStub }
}
describe('Log Decorator', () => {
  test('Should call controller handle with correct values', async () => {
    const { sut, controllerStub } = makeSut()
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
  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_value',
        email: 'any_value@mail.com,',
        password: 'any_value',
        passwordConfirmation: 'any_value'
      }
    }
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        id: 'any_value',
        name: 'any_value',
        email: 'any_value@mail.com,',
        password: 'any_value'
      }
    })
  })
})
