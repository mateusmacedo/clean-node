import { InvalidParamError } from '../../../src/presentation/erros'
import { CompareFieldValidation } from '../../../src/presentation/validation'

const makeFakeInput = (): any => ({
  param: 'any_value',
  paramConfirmation: 'otherValue'
})

interface SutTypes {
  sut: CompareFieldValidation
}

const makeSut = (param: string, paramToCompare: string): SutTypes => {
  const sut = new CompareFieldValidation(param, paramToCompare)
  return { sut }
}

describe('Compare Validation', () => {
  test('Should return error InvalidParamError if validation fail', async () => {
    const { sut } = makeSut('param', '')
    const input = makeFakeInput()
    const result = await sut.validate(input)
    expect(result).toEqual(new InvalidParamError('param'))
  })
  test('Should not return if validation succeds', async () => {
    const { sut } = makeSut('name', 'paramConfirmation')
    jest.spyOn(sut, 'validate').mockImplementationOnce(async () => {
      return new Promise(resolve => resolve(null))
    })
    const input = makeFakeInput()
    const result = await sut.validate(input)
    expect(result).toBeFalsy()
  })
  test('Should throw if email validator throws', async () => {
    const { sut } = makeSut('name', 'paramConfirmation')
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
