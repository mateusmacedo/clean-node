import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptografy/bcrypt-adapter'
import { AccountMongoRepository, LogMongoRepository } from '../../../infra/db/mongodb/repositories'
import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { Controller } from '../../../presentation/protocols'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation'

export const makeSignupController = (): Controller => {
  const encrypter = new BcryptAdapter(env.security.salt)
  const accountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(encrypter, accountRepository)
  const validationComposite = makeSignUpValidation()
  const controller = new SignUpController(addAccount, validationComposite)
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logErrorRepository)
}
