import { InvalidParamError } from '../../../src/presentation/erros'
import { Validation } from '../../../src/presentation/protocols/validation'
import { ValidationComposite } from '../../../src/presentation/validation'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error> {
      return new Promise(resolve => resolve(new InvalidParamError('param')))
    }
  }

  return new ValidationStub()
}

const makeSut = (validations: Validation[]): ValidationComposite => {
  return new ValidationComposite(validations)
}

const makeFakeInput = (): any => ({
  param: 'any_value'
})

describe('Validation Composite', () => {
  test('Should return InvalidParamError', async () => {
    const validationStub = makeValidation()
    const sut = makeSut([validationStub])
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Promise(resolve => resolve(new InvalidParamError('param'))))
    const fakeInput = makeFakeInput()
    const result = await sut.validate(fakeInput)
    expect(result).toEqual(new InvalidParamError('param'))
  })
})
