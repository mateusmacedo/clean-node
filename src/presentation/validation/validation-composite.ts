import { Validation } from '../protocols'

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]

  constructor (validations: Validation[]) {
    this.validations = validations
  }

  async validate (input: any): Promise<Error> {
    for (const validation of this.validations) {
      const error = await validation.validate(input)
      if (error) {
        return new Promise(resolve => resolve(error))
      }
    }
  }
}
