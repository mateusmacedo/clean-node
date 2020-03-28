import request from 'supertest'
import app from '../../../src/main/config/app'

describe('Cors middleware', () => {
  test('Should enabled cors', async () => {
    app.post('/test_cors', (req, res) => {
      res.send()
    })
    await request(app).get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
