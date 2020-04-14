import { MissingParamError } from '../erros'
import { Validation } from '../protocols/validation'

export class RequiredFieldValidation implements Validation {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  async validate (input: any): Promise<Error> {
    if (!input[this.fieldName]) {
      return new Promise(resolve => resolve(new MissingParamError(this.fieldName)))
    }
  }
}
