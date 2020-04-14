import { InvalidParamError } from '../erros'
import { Validation } from '../protocols/validation'

export class CompareFieldValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldToCompareName: string

  constructor (fieldName: string, fieldToCompareName: string) {
    this.fieldName = fieldName
    this.fieldToCompareName = fieldToCompareName
  }

  async validate (input: any): Promise<Error> {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new Promise(resolve => resolve(new InvalidParamError(this.fieldName)))
    }
  }
}
