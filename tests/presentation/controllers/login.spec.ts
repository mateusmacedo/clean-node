import { LoginController } from '../../../src/presentation/controllers/signup/login'
import { MissingParamError } from '../../../src/presentation/erros'
import { badRequest } from '../../../src/presentation/helpers/http-helper'

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = new LoginController()
    const request = {
      body: {
        password: 'any_password'
      }
    }
    const result = await sut.handler(request)
    expect(result).toEqual(badRequest(new MissingParamError('email')))
  })
  test('Should return 400 if no password is provided', async () => {
    const sut = new LoginController()
    const request = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const result = await sut.handler(request)
    expect(result).toEqual(badRequest(new MissingParamError('password')))
  })
})
