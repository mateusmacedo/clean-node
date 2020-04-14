import { LoginController } from '../../../src/presentation/controllers/login/login'
import {
  Authentication,
  EmailValidator,
  HttpRequest
} from '../../../src/presentation/controllers/login/login-protocols'
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
  UnauthorizedError
} from '../../../src/presentation/erros'
import { badRequest, okRequest, serverError } from '../../../src/presentation/helpers/http-helper'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    async isValid (email: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return { sut, emailValidatorStub, authenticationStub }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const request = makeFakeHttpRequest()
    delete request.body.email
    const result = await sut.handler(request)
    expect(result).toEqual(badRequest(new MissingParamError('email')))
  })
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const request = makeFakeHttpRequest()
    delete request.body.password
    const result = await sut.handler(request)
    expect(result).toEqual(badRequest(new MissingParamError('password')))
  })
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const request = makeFakeHttpRequest()
    await sut.handler(request)
    expect(isValidSpy).toHaveBeenCalledWith(request.body.email)
  })
  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const request = makeFakeHttpRequest()
    const response = await sut.handler(request)
    expect(response).toEqual(badRequest(new InvalidParamError('email')))
  })
  test('Should return 500 if email validator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
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
    expect(authSpy).toHaveBeenCalledWith(email, password)
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
    expect(httpResponse).toEqual(okRequest('any_token'))
  })
})
