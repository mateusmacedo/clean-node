import { Authentication } from '../../../src/domain/usercases/authentication'
import { LoginController } from '../../../src/presentation/controllers/signup/login'
import { InvalidParamError, MissingParamError, ServerError } from '../../../src/presentation/erros'
import { badRequest, serverError } from '../../../src/presentation/helpers/http-helper'
import { HttpRequest } from '../../../src/presentation/protocols'
import { EmailValidator } from '../../../src/presentation/protocols/email-validator'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeFakeHttpRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('jwt token'))
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
})
