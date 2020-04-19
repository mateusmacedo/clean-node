import { MissingParamError } from '../../../src/presentation/erros'
import { Validation } from '../../../src/presentation/protocols/validation'
import { RequiredFieldValidation } from '../../../src/presentation/validation'

const makeSut = (field: string): Validation => {
  return new RequiredFieldValidation(field)
}

describe('Required Field Validation', () => {
  test('Should not return if validation succeeds', async () => {
    const sut = makeSut('param')
    const result = await sut.validate({
      param: 'any_value'
    })
    expect(result).toBeFalsy()
  })
  test('Should return MissingParamError if validation fail', async () => {
    const sut = makeSut('paramRequired')
    const result = await sut.validate({
      param: 'any_value'
    })
    expect(result).toEqual(new MissingParamError('paramRequired'))
  })
  test('Should throw if email validator throws', async () => {
    const sut = makeSut('paramRequired')
    jest.spyOn(sut, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    try {
      await sut.validate({
        param: 'any_value'
      })
    } catch (e) {
      expect(e).toEqual(new Error())
    }
  })
})
