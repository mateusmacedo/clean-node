import { InvalidParamError } from '../erros'
import { EmailValidator, Validation } from '../protocols'

export class EmailValidation implements Validation {
  private readonly fieldName: string
  private readonly emailValidator: EmailValidator

  constructor (fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  async validate (input: any): Promise<Error> {
    if (!await this.emailValidator.isValid(input[this.fieldName])) {
      return new Promise(resolve => resolve(new InvalidParamError(this.fieldName)))
    }
  }
}
