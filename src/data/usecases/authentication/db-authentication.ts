import { Authentication, AuthenticationModel } from '../../../domain/usercases'
import { HashCompare, TokenGenerator } from '../../protocols/criptography'
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '../../protocols/db'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashCompare: HashCompare, tokenGenerator: TokenGenerator, updateAccessTokenRepository: UpdateAccessTokenRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authenticationModel: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authenticationModel.email)
    if (account) {
      const isValidPassword = await this.hashCompare.compare(authenticationModel.password, account.password)
      if (isValidPassword) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, accessToken)
        return new Promise(resolve => resolve(accessToken))
      }
    }
    return null
  }
}
