import { MissingParamError } from '../../../src/presentation/erros'
import { RequiredFieldValidation } from '../../../src/presentation/validation'

const makeFakeInput = (): any => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

interface SutTypes {
  sut: RequiredFieldValidation
}

const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidation('param')
  return { sut }
}

describe('Required Validation', () => {
  test('Should return error MissingParamError if validation fail', async () => {
    const { sut } = makeSut()
    const input = makeFakeInput()
    const result = await sut.validate(input)
    expect(result).toEqual(new MissingParamError('param'))
  })
  test('Should throw if email validator throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(sut, 'validate').mockImplementationOnce(() => {
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
