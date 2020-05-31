import { EmailValidatorAdapter } from '../../../../src/main/adapters/email-validator-adapter'
import { makeLoginValidation } from '../../../../src/main/factories/controllers/login/login-validation-factory'
import { Validation } from '../../../../src/presentation/protocols/validation'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../src/presentation/validation'

jest.mock('../../../../src/presentation/validation/validation-composite')

const makeFakeValidationData = (): any => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

describe('LoginValidation Factory', () => {
  test('Should call validation composite with all validations', async () => {
    const validation = makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    await validation.validate(makeFakeValidationData())
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
