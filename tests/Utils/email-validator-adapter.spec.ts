import { EmailValidatorAdapter } from '../../src/Utils/email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  test('Should return false if validator fail', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(false)
  })
  test('Should return true if validator success', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })
  test('Should call EmailValidatorAdapter with correct values', () => {
    const sut = new EmailValidatorAdapter()
    const isValidSpy = jest.spyOn(sut, 'isValid')
    sut.isValid('any_email@email.com')
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })
})
