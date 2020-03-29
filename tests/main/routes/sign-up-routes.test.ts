import request from 'supertest'
import app from '../../../src/main/config/app'

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Mateus',
        email: 'macedodosanjosmateus@gmail.com',
        password: 'secret*123',
        passwordConfirmation: 'secret*123'
      }).expect(200)
  })
})
