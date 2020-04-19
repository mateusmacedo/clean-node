import { InvalidParamError, MissingParamError } from '../../../src/presentation/erros'
import { Validation } from '../../../src/presentation/protocols/validation'
import { ValidationComposite } from '../../../src/presentation/validation'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error> {
      return new Promise(resolve => resolve(null))
    }
  }

  return new ValidationStub()
}

const makeSut = (validations: Validation[]): ValidationComposite => {
  return new ValidationComposite(validations)
}

describe('Validation Composite', () => {
  test('Should return InvalidParamError', async () => {
    const validationStub = makeValidation()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Promise(resolve => resolve(new InvalidParamError('param'))))
    const sut = makeSut([validationStub])
    const result = await sut.validate({
      param: 'any_value'
    })
    expect(result).toEqual(new InvalidParamError('param'))
  })
  test('Should return MissingParamError', async () => {
    const validationStub = makeValidation()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Promise(resolve => resolve(new MissingParamError('param'))))
    const sut = makeSut([validationStub])
    const result = await sut.validate({
      param: 'any_value'
    })
    expect(result).toEqual(new MissingParamError('param'))
  })
  test('Should return the first error if more then on validation fail', async () => {
    const InvalidValidationStub = makeValidation()
    const MissingValidationStub = makeValidation()
    jest.spyOn(InvalidValidationStub, 'validate').mockReturnValueOnce(new Promise(resolve => resolve(new InvalidParamError('param'))))
    jest.spyOn(MissingValidationStub, 'validate').mockReturnValueOnce(new Promise(resolve => resolve(new MissingParamError('param'))))
    const sut = makeSut([InvalidValidationStub, MissingValidationStub])
    const result = await sut.validate({ param: 'any_value' })
    expect(result).toEqual(new InvalidParamError('param'))
  })
  test('Should throw if any validation throws', async () => {
    const InvalidValidationStub = makeValidation()
    const MissingValidationStub = makeValidation()
    jest.spyOn(InvalidValidationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    jest.spyOn(MissingValidationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const sut = makeSut([InvalidValidationStub, MissingValidationStub])
    try {
      await sut.validate({
        param: 'any_value'
      })
    } catch (e) {
      expect(e).toEqual(new Error())
    }
  })
  test('Should return null if validation is succeeds', async () => {
    const InvalidValidationStub = makeValidation()
    const MissingValidationStub = makeValidation()
    const sut = makeSut([InvalidValidationStub, MissingValidationStub])
    const result = await sut.validate({ param: 'any_value' })
    expect(result).toBeFalsy()
  })
})
