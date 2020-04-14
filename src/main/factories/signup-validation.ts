import { CompareFieldValidation } from '../../presentation/validation/compare-field-validation'
import { RequiredFieldValidation } from '../../presentation/validation/required-field-validation'
import { ValidationComposite } from '../../presentation/validation/validation-composite'

export const makeSignUpValidation = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldValidation('name'),
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new RequiredFieldValidation('passwordConfirmation'),
    new CompareFieldValidation('password', 'passwordConfirmation')
  ])
}
