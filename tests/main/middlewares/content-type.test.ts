import request from 'supertest'
import app from '../../../src/main/config/app'

describe('ContentType middleware', () => {
  test('Should return content-type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })
    await request(app).get('/test_content_type')
      .expect('content-type', /json/)
  })
})
