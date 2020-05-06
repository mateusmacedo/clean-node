import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/criptografy/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptografy/jwt-adapter'
import { AccountMongoRepository, LogMongoRepository } from '../../../infra/db/mongodb'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter(env.security.salt)
  const jwtAdapter = new JwtAdapter(env.security.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const validation = makeLoginValidation()
  const authentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const loginController = new LoginController(authentication, validation)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
