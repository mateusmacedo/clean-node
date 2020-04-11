import { LogErrorRepository } from '../../../src/data/protocols/log-error-repository'
import { LogControllerDecorator } from '../../../src/main/decorators/log-controller-decorator'
import { serverError } from '../../../src/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../../src/presentation/protocols'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
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

const makeLoggerRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }

  return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
  const logErrorRepositoryStub = makeLoggerRepository()
  const controllerStub = makeController()
  const logControllerDecorator = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut: logControllerDecorator, controllerStub, logErrorRepositoryStub }
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
  test('Should call LogErrorRepository with correct error data', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    jest.spyOn(controllerStub, 'handler')
      .mockReturnValueOnce(new Promise(resolve => resolve(error)))
    const httpRequest = {
      body: {
        name: 'any_value',
        email: 'any_value@mail.com,',
        password: 'any_value',
        passwordConfirmation: 'any_value'
      }
    }
    await sut.handler(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
