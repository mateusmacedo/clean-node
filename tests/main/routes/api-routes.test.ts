import { Collection } from 'mongodb'
import request from 'supertest'
import { AddAccountModel } from '../../../src/domain/usercases'
import { BcryptAdapter } from '../../../src/infra/criptografy/bcrypt-adapter'
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers/mongo-helper'
import app from '../../../src/main/config/app'

describe('Api Routes', () => {
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
  const makeFakeAddAccount = (): AddAccountModel => ({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  })
  describe('POST /signup', () => {
    test('Should return 201 on success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Mateus',
          email: 'macedodosanjosmateus@gmail.com',
          password: 'secret*123',
          passwordConfirmation: 'secret*123'
        }).expect(201)
    })
  })
  describe('POST /login', () => {
    test('Should return 200 on success', async () => {
      const fakeAddAccountModel = makeFakeAddAccount()
      const bcryptAdapter = new BcryptAdapter(12)
      const passwordHashed = await bcryptAdapter.hash(fakeAddAccountModel.password)
      const fakeAccount = Object.assign(Object.assign({}, fakeAddAccountModel, { password: passwordHashed }))
      await accountCollection.insertOne(fakeAccount)
      await request(app)
        .post('/api/login')
        .send({
          email: fakeAddAccountModel.email,
          password: fakeAddAccountModel.password
        }).expect(200)
    })
    test('Should return 401 if invalid credentials', async () => {
      const fakeAddAccountModel = makeFakeAddAccount()
      await request(app)
        .post('/api/login')
        .send({
          email: fakeAddAccountModel.email,
          password: fakeAddAccountModel.password
        }).expect(401)
    })
  })
})
