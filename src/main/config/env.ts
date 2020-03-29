import dotenv from 'dotenv'

dotenv.config()

export default {
  server: {
    env: process.env.ENV || 'staged',
    host: process.env.HOST,
    port: process.env.PORT || 3000
  },
  security: {
    salt: Number(process.env.SALT_DEFAULT)
  },
  infra: {
    noSql: {
      host: process.env.NOSQL_HOST,
      port: process.env.NOSQL_PORT,
      schema: process.env.NOSQL_DATABASE,
      user: process.env.NOSQL_USER,
      pass: process.env.NOSQL_PASS
    }
  },
  mongoUrl: `mongodb://${process.env.NOSQL_USER}:${process.env.NOSQL_PASS}@${process.env.NOSQL_HOST}:${process.env.NOSQL_PORT}/${process.env.NOSQL_DATABASE}`
}
