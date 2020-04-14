import { LoginController } from '../../../src/presentation/controllers/signup/login'
import { MissingParamError } from '../../../src/presentation/erros'
import { badRequest } from '../../../src/presentation/helpers/http-helper'

interface SutTypes {
  sut: LoginController
}

const makeSut = (): SutTypes => {
  const sut = new LoginController()
  return { sut }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const request = {
      body: {
        password: 'any_password'
      }
    }
    const result = await sut.handler(request)
    expect(result).toEqual(badRequest(new MissingParamError('email')))
  })
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const request = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const result = await sut.handler(request)
    expect(result).toEqual(badRequest(new MissingParamError('password')))
  })
})
