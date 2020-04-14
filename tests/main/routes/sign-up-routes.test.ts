import request from 'supertest'
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers/mongo-helper'
import app from '../../../src/main/config/app'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Mateus',
        email: 'macedodosanjosmateus@gmail.com',
        password: 'secret*123',
        passwordConfirmation: 'secret*123'
      }).expect(201)
  })
  test('Should return an account on success', async () => {
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
