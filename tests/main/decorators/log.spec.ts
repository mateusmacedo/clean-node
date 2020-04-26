
import { LogErrorRepository } from '../../../src/data/protocols/db'
import { LogControllerDecorator } from '../../../src/main/decorators/log-controller-decorator'
import { createdRequest, serverError } from '../../../src/presentation/helpers/http-response-helper'
import { Controller, HttpRequest, HttpResponse } from '../../../src/presentation/protocols'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_value',
    email: 'any_value@mail.com,',
    password: 'any_value',
    passwordConfirmation: 'any_value'
  }
})

const makeFakeAccountModel = (): Object => ({
  id: 'any_value',
  name: 'any_value',
  email: 'any_value@mail.com,',
  password: 'any_value'
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handler (httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(createdRequest(makeFakeAccountModel())))
    }
  }

  return new ControllerStub()
}

const makeLoggerRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
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
    const httpRequest = makeFakeHttpRequest()
    await sut.handler(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(createdRequest(makeFakeAccountModel()))
  })
  test('Should call LogErrorRepository with correct error data', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handler')
      .mockReturnValueOnce(new Promise(resolve => resolve(makeFakeServerError())))
    const httpRequest = makeFakeHttpRequest()
    await sut.handler(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
