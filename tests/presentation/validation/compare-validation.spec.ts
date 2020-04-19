import { InvalidParamError } from '../../../src/presentation/erros'
import { Validation } from '../../../src/presentation/protocols/validation'
import { CompareFieldValidation } from '../../../src/presentation/validation'

const makeSut = (param: string, paramToCompare: string): Validation => {
  return new CompareFieldValidation(param, paramToCompare)
}

describe('Compare Validation', () => {
  test('Should not return if validation succeeds', async () => {
    const sut = makeSut('param', 'paramToCompare')
    const result = await sut.validate({
      param: 'any_value',
      paramToCompare: 'any_value'
    })
    expect(result).toBeFalsy()
  })
  test('Should return error InvalidParamError if validation fail', async () => {
    const sut = makeSut('param', 'paramToCompare')
    const result = await sut.validate({
      param: 'any_value',
      paramToCompare: 'other_value'
    })
    expect(result).toEqual(new InvalidParamError('paramToCompare'))
  })
  test('Should throw if email validator throws', async () => {
    const sut = makeSut('name', 'paramToCompare')
    jest.spyOn(sut, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    try {
      await sut.validate({
        param: 'any_value',
        paramToCompare: 'any_value'
      })
    } catch (e) {
      expect(e).toEqual(new Error())
    }
  })
})
