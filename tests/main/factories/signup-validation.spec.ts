import { makeSignUpValidation } from '../../../src/main/factories/signup-validation'
import { Validation } from '../../../src/presentation/protocols/validation'
import { CompareFieldValidation } from '../../../src/presentation/validation/compare-field-validation'
import { EmailValidation } from '../../../src/presentation/validation/email-validation'
import { RequiredFieldValidation } from '../../../src/presentation/validation/required-field-validation'
import { ValidationComposite } from '../../../src/presentation/validation/validation-composite'
import { EmailValidatorAdapter } from '../../../src/utils/email-validator-adapter'

jest.mock('../../../src/presentation/validation/validation-composite')

const makeFakeValidationData = (): any => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

describe('SignupValidation Factory', () => {
  test('Should call validation composite with all validations', async () => {
    const validation = makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    await validation.validate(makeFakeValidationData())
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
