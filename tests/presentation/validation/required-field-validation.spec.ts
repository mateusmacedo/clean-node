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

const makeSut = (field: string): SutTypes => {
  const sut = new RequiredFieldValidation(field)
  return { sut }
}

describe('Required Field Validation', () => {
  test('Should return MissingParamError if validation fail', async () => {
    const { sut } = makeSut('paramRequired')
    const input = makeFakeInput()
    const result = await sut.validate(input)
    expect(result).toEqual(new MissingParamError('paramRequired'))
  })
  test('Should not return if validation succeds', async () => {
    const { sut } = makeSut('name')
    const input = makeFakeInput()
    const result = await sut.validate(input)
    expect(result).toBeFalsy()
  })
  test('Should throw if email validator throws', async () => {
    const { sut } = makeSut('paramRequired')
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
