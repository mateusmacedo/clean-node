import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../presentation/validation'
import { EmailValidatorAdapter } from '../../../adapters/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new EmailValidation('email', new EmailValidatorAdapter())
  ])
}
