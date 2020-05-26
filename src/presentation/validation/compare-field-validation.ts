import { InvalidParamError } from '../erros'
import { Validation } from '../protocols'

export class CompareFieldValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly fieldToCompareName: string) {}

  async validate (input: any): Promise<Error> {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return Promise.resolve(new InvalidParamError(this.fieldToCompareName))
    }
  }
}
