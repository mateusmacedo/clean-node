import validator from 'validator'
import { EmailValidator } from '../../presentation/protocols'

export class EmailValidatorAdapter implements EmailValidator {
  async isValid (email: string): Promise<boolean> {
    return Promise.resolve(validator.isEmail(email))
  }
}
