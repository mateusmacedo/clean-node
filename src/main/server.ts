import app from './config/app'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(() => {
    app.listen(env.server.port, () => console.log(`Running at port: ${env.server.port.toString()}`))
  })
  .catch(console.error)
