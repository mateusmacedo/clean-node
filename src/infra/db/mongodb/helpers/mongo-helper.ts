import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async disconnect (): Promise<void> {
    await this.client.close()
  },

  async getCollection (name: string): Promise<Collection> {
    return new Promise(resolve => resolve(this.client.db().collection(name)))
  },

  async map (collection: any): Promise<any> {
    const { _id, ...collectionWithOutId } = collection
    const model = Object.assign({}, collectionWithOutId, { id: _id })
    return new Promise(resolve => resolve(model))
  }
}
