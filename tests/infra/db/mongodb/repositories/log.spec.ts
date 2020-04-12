import { Collection } from 'mongodb'
import { MongoHelper } from '../../../../../src/infra/db/mongodb/helpers/mongo-helper'
import { LogMongoRepository } from '../../../../../src/infra/db/mongodb/repositories/log'

describe('Log Mongo Repository', () => {
  let errorsCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorsCollection = await MongoHelper.getCollection('errors')
    await errorsCollection.deleteMany({})
  })

  const makeSut = (): LogMongoRepository => {
    return new LogMongoRepository()
  }

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_stack')
    const count = await errorsCollection.countDocuments()
    expect(count).toBe(1)
  })
})
