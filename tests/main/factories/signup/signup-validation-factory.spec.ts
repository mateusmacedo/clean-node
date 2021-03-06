import { EmailValidatorAdapter } from '../../../../src/main/adapters/email-validator-adapter'
import { makeSignUpValidation } from '../../../../src/main/factories/controllers/signup/signup-validation-factory'
import { Validation } from '../../../../src/presentation/protocols'
import {
  CompareFieldValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../src/presentation/validation'

jest.mock('../../../../src/presentation/validation/validation-composite')

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
