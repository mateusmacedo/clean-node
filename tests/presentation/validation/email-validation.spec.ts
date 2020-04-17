import { InvalidParamError } from '../../../src/presentation/erros'
import { EmailValidator } from '../../../src/presentation/protocols/email-validator'
import { EmailValidation } from '../../../src/presentation/validation'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    async isValid (email: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }

  return new EmailValidatorStub()
}

const makeFakeInput = (): any => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('Email Validation', () => {
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const input = makeFakeInput()
    await sut.validate(input)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('Should return error InvalidParamError fail', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const input = makeFakeInput()
    const result = await sut.validate(input)
    expect(result).toEqual(new InvalidParamError('email'))
  })
  test('Should throw if email validator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const input = makeFakeInput()
    try {
      await sut.validate(input)
    } catch (e) {
      expect(e).toEqual(new Error())
    }
  })
})
