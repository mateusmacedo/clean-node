import { MissingParamError } from '../erros'
import { Validation } from '../protocols'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {
    this.fieldName = fieldName
  }

  async validate (input: any): Promise<Error> {
    if (!input[this.fieldName]) {
      return Promise.resolve(new MissingParamError(this.fieldName))
    }
  }
}
