import { LoadAccountByEmailRepository } from '../../../../src/data/protocols/repositories/load-account-by-email-repository'
import { DbAuthentication } from '../../../../src/data/usecases/authentication/db-authentication'
import { AccountModel } from '../../../../src/domain/models/account'
import { Authentication } from '../../../../src/domain/usercases'

interface SutTypes {
  sut: Authentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeLoadAccountByEmailRepositoryStubSut = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account: AccountModel = {
        id: 'any_value',
        name: 'any_value',
        email: 'any_value@email.com',
        password: 'any_value'
      }
      return new Promise(resolve => resolve(account))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStubSut()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return { sut, loadAccountByEmailRepositoryStub }
}
describe('DbAuthentication use case', () => {
  test('Should call LoadAccountByEmailRepository with correct values', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    const fakeAuthenticationModel = { email: 'any_value@email', password: 'any_value' }
    await sut.auth(fakeAuthenticationModel)
    expect(loadSpy).toHaveBeenCalledWith(fakeAuthenticationModel.email)
  })
})