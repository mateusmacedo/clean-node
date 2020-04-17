import { InvalidParamError } from '../../../src/presentation/erros'
import { Validation } from '../../../src/presentation/protocols/validation'
import { ValidationComposite } from '../../../src/presentation/validation'

interface SutTypes {
  sut: ValidationComposite
  validationStub: Validation
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error> {
      return new Promise(resolve => resolve(new InvalidParamError('param')))
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])
  return { sut, validationStub }
}

const makeFakeInput = (): any => ({
  param: 'any_value'
})

describe('Validation Composite', () => {
  test('Should return InvalidParamError', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Promise(resolve => resolve(new InvalidParamError('param'))))
    const fakeInput = makeFakeInput()
    const result = await sut.validate(fakeInput)
    expect(result).toEqual(new InvalidParamError('param'))
  })
})
