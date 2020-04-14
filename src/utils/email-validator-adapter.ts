import { EmailValidator } from '../presentation/protocols/email-validator'
import validator from 'validator'

export class EmailValidatorAdapter implements EmailValidator {
  async isValid (email: string): Promise<boolean> {
    return new Promise(resolve => resolve(validator.isEmail(email)))
  }
}
