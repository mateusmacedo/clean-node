import { Authentication, AuthenticationModel } from '../../../domain/usercases'
import { HashCompare, LoadAccountByEmailRepository } from '../../protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashCompare: HashCompare) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
  }

  async auth (authenticationModel: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authenticationModel.email)
    if (account) {
      await this.hashCompare.compare(authenticationModel.password, account.password)
    }
    return new Promise(resolve => resolve(null))
  }
}
