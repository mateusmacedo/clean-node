import { SignUpController } from '../../../src/presentation/controllers/signup/signup'
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  EmailValidator,
  HttpRequest
} from '../../../src/presentation/controllers/signup/signup-protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../../src/presentation/erros'
import {
  badRequest,
  createdRequest,
  serverError
} from '../../../src/presentation/helpers/http-helper'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    async isValid (email: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }

  return new EmailValidatorStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()
      return new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('User Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    delete httpRequest.body.name
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    delete httpRequest.body.email
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    delete httpRequest.body.password
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
  test('Should return 400 if no passwordConfirm is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    delete httpRequest.body.passwordConfirmation
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })
  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    httpRequest.body.passwordConfirmation = 'invalid_password'
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeHttpRequest()
    await sut.handler(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('Should return 500 if email validator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack_error')))
  })
  test('Should return 500 if addAccounts throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => {
        reject(new Error())
      })
    })
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack_error')))
  })
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeHttpRequest()
    await sut.handler(httpRequest)
    const expectAccount = makeFakeAccount()
    delete expectAccount.id
    expect(addSpy).toHaveBeenCalledWith(expectAccount)
  })
  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse).toEqual(createdRequest(makeFakeAccount()))
  })
})
