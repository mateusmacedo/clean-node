import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptografy/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/repositories/account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../Utils/email-validator-adapter'
import env from '../config/env'
import { LogControllerDecorator } from '../decorators/log-controller-decorator'

export const makeSignupController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter()
  const encrypter = new BcryptAdapter(env.security.salt)
  const accountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(encrypter, accountRepository)
  const signUpController = new SignUpController(emailValidator, addAccount)
  return new LogControllerDecorator(signUpController)
}
