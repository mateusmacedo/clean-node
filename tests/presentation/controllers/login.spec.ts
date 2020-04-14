import { LoginController } from '../../../src/presentation/controllers/signup/login'
import { MissingParamError } from '../../../src/presentation/erros'
import { badRequest } from '../../../src/presentation/helpers/http-helper'
import { HttpRequest } from '../../../src/presentation/protocols'
import { EmailValidator } from '../../../src/presentation/protocols/email-validator'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }
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
  const sut = new LoginController(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const request = makeRequest()
    delete request.body.email
    const result = await sut.handler(request)
    expect(result).toEqual(badRequest(new MissingParamError('email')))
  })
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const request = makeRequest()
    delete request.body.password
    const result = await sut.handler(request)
    expect(result).toEqual(badRequest(new MissingParamError('password')))
  })
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const request = makeRequest()
    await sut.handler(request)
    expect(isValidSpy).toHaveBeenCalledWith(request.body.email)
  })
})
