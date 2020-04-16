import { CompareFieldValidation } from '../../presentation/validation/compare-field-validation'
import { EmailValidation } from '../../presentation/validation/email-validation'
import { RequiredFieldValidation } from '../../presentation/validation/required-field-validation'
import { ValidationComposite } from '../../presentation/validation/validation-composite'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldValidation('name'),
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new RequiredFieldValidation('passwordConfirmation'),
    new CompareFieldValidation('password', 'passwordConfirmation'),
    new EmailValidation('email', new EmailValidatorAdapter())
  ])
}
