import { EmailValidatorAdapter } from '../../src/Utils/email-validator-adapter'

describe('EmailValidator Adapter', () => {
  test('Should return false if validator fail', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
})