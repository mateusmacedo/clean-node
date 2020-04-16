import { InvalidParamError } from '../../../src/presentation/erros'
import { CompareFieldValidation } from '../../../src/presentation/validation/compare-field-validation'

const makeFakeInput = (): any => ({
  param: 'any_value',
  paramConfirmation: 'otherValue'
})

interface SutTypes {
  sut: CompareFieldValidation
}

const makeSut = (): SutTypes => {
  const sut = new CompareFieldValidation('param', 'paramConfirmation')
  return { sut }
}

describe('Required Validation', () => {
  test('Should return error InvalidParamError if validation fail', async () => {
    const { sut } = makeSut()
    const input = makeFakeInput()
    const result = await sut.validate(input)
    expect(result).toEqual(new InvalidParamError('param'))
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
