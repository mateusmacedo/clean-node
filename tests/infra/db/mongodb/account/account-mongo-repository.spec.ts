import { Collection } from 'mongodb'
import { AddAccountModel } from '../../../../../src/domain/usercases'
import { MongoHelper } from '../../../../../src/infra/db/mongodb/helpers/mongo-helper'
import { AccountMongoRepository } from '../../../../../src/infra/db/mongodb'

describe('Accounts Mongo Repository', () => {
  let accountCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  const makeFakeAddAccount = (): AddAccountModel => ({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  })

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const fakeAddAccountModel = makeFakeAddAccount()
    const account = await sut.add(fakeAddAccountModel)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(fakeAddAccountModel.name)
    expect(account.email).toBe(fakeAddAccountModel.email)
    expect(account.password).toBe(fakeAddAccountModel.password)
  })
  test('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    const fakeAddAccountModel = makeFakeAddAccount()
    await accountCollection.insertOne(fakeAddAccountModel)
    const account = await sut.loadByEmail(fakeAddAccountModel.email)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(fakeAddAccountModel.name)
    expect(account.email).toBe(fakeAddAccountModel.email)
    expect(account.password).toBe(fakeAddAccountModel.password)
  })
  test('Should return null if account on loadByEmail fails', async () => {
    const sut = makeSut()
    const fakeAddAccountModel = makeFakeAddAccount()
    const account = await sut.loadByEmail(fakeAddAccountModel.email)
    expect(account).toBeFalsy()
  })
  test('Should update an account  accessToken on updateAccessToken success', async () => {
    const sut = makeSut()
    const fakeAddAccountModel = makeFakeAddAccount()
    const result = await accountCollection.insertOne(fakeAddAccountModel)
    const accountModel = result.ops[0]
    expect(accountModel.accessToken).toBeFalsy()
    await sut.updateAccessToken(accountModel._id, 'any_token')
    const account = await accountCollection.findOne({ _id: accountModel._id })
    expect(account).toBeTruthy()
    expect(account.accessToken).toEqual('any_token')
  })
})
