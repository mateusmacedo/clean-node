import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from '../../usecases/db-add-account-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignupController = (): Controller => {
  const addAccount = makeDbAddAccount()
  const validationComposite = makeSignUpValidation()
  const controller = new SignUpController(addAccount, validationComposite)
  return makeLogControllerDecorator(controller)
}
