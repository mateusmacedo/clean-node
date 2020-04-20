import { Authentication, AuthenticationModel } from '../../../domain/usercases'
import { HashCompare, TokenGenerator } from '../../protocols/criptography'
import { LoadAccountByEmailRepository } from '../../protocols/db'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare
  private readonly tokenGenerator: TokenGenerator

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashCompare: HashCompare, tokenGenerator: TokenGenerator) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenGenerator = tokenGenerator
  }

  async auth (authenticationModel: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authenticationModel.email)
    if (account) {
      await this.hashCompare.compare(authenticationModel.password, account.password)
      await this.tokenGenerator.generate(account.id)
    }
    return new Promise(resolve => resolve(null))
  }
}
