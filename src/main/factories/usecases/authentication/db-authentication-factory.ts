import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import { Authentication } from '../../../../domain/usercases'
import { BcryptAdapter } from '../../../../infra/criptografy/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/criptografy/jwt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb'
import env from '../../../config/env'

export const makeDbAuthentication = (): Authentication => {
  const bcryptAdapter = new BcryptAdapter(env.security.salt)
  const jwtAdapter = new JwtAdapter(env.security.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
