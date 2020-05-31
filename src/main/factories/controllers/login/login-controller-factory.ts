import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const validation = makeLoginValidation()
  const authentication = makeDbAuthentication()
  const loginController = new LoginController(authentication, validation)
  return makeLogControllerDecorator(loginController)
}
