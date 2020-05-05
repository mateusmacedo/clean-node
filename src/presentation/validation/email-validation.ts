import { InvalidParamError } from '../erros'
import { EmailValidator, Validation } from '../protocols'

export class EmailValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly emailValidator: EmailValidator) {}

  async validate (input: any): Promise<Error> {
    if (!await this.emailValidator.isValid(input[this.fieldName])) {
      return new Promise(resolve => resolve(new InvalidParamError(this.fieldName)))
    }
  }
}
