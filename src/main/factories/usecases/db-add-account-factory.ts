import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { AddAccount } from '../../../domain/usercases'
import { BcryptAdapter } from '../../../infra/criptografy/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb'
import env from '../../config/env'

export const makeDbAddAccount = (): AddAccount => {
  const encrypter = new BcryptAdapter(env.security.salt)
  const accountRepository = new AccountMongoRepository()
  const loadAccountByEmailRepository = new AccountMongoRepository()
  return new DbAddAccount(encrypter, accountRepository, loadAccountByEmailRepository)
}
