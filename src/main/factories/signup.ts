import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptografy/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/repositories/account'
import { LogMongoRepository } from '../../infra/db/mongodb/repositories/log'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import env from '../config/env'
import { LogControllerDecorator } from '../decorators/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation'

export const makeSignupController = (): Controller => {
  const encrypter = new BcryptAdapter(env.security.salt)
  const accountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(encrypter, accountRepository)
  const emailValidator = new EmailValidatorAdapter()
  const validationComposite = makeSignUpValidation()
  const controller = new SignUpController(emailValidator, addAccount, validationComposite)
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logErrorRepository)
}
