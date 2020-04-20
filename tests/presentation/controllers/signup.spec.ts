import { SignUpController } from '../../../src/presentation/controllers/signup/signup'
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
  Validation
} from '../../../src/presentation/controllers/signup/signup-protocols'
import { ServerError } from '../../../src/presentation/erros'
import {
  badRequest,
  createdRequest,
  serverError
} from '../../../src/presentation/helpers/http-response-helper'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error> {
      return new Promise(resolve => resolve(null))
    }
  }

  return new ValidationStub()
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
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('User Controller', () => {
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
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeHttpRequest()
    await sut.handler(httpRequest)
    const expectAccount = makeFakeAccount()
    delete expectAccount.id
    expect(addSpy).toHaveBeenCalledWith(expectAccount)
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
  test('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse).toEqual(createdRequest(makeFakeAccount()))
  })
})
