import { LoginController } from '../../../src/presentation/controllers/login/login'
import { Authentication, HttpRequest, Validation } from '../../../src/presentation/controllers/login/login-protocols'
import { ServerError, UnauthorizedError } from '../../../src/presentation/erros'
import { badRequest, okRequest, serverError } from '../../../src/presentation/helpers/http-response-helper'

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authenticationModel): Promise<string> {
      return new Promise(resolve => resolve('any_value'))
    }
  }

  return new AuthenticationStub()
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error> {
      return Promise.resolve(null)
    }
  }

  return new ValidationStub()
}

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()
  const validationStub = makeValidationStub()
  const sut = new LoginController(authenticationStub, validationStub)
  return { sut, authenticationStub, validationStub }
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_value@email.com',
    password: 'any_value'
  }
})

describe('Login Controller', () => {
  test('Should call Validation an with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeHttpRequest()
    await sut.handler(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new Promise(resolve => resolve(new Error('any_field'))))
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse).toEqual(badRequest(new Error('any_field')))
  })
  test('Should return 500 if validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const request = makeFakeHttpRequest()
    const response = await sut.handler(request)
    expect(response).toEqual(serverError(new ServerError('any_stack_error')))
  })
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const request = makeFakeHttpRequest()
    const { email, password } = request.body
    await sut.handler(request)
    expect(authSpy).toHaveBeenCalledWith({ email, password })
  })
  test('Should return 401 if an invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const request = makeFakeHttpRequest()
    const response = await sut.handler(request)
    expect(response).toEqual(badRequest(new UnauthorizedError()))
  })
  test('Should return 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => {
        reject(new Error())
      })
    })
    const request = makeFakeHttpRequest()
    const response = await sut.handler(request)
    expect(response).toEqual(serverError(new ServerError('any_stack_error')))
  })
  test('Should return 200 if valid credentials is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse).toEqual(okRequest('any_value'))
  })
})
