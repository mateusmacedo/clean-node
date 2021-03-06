import { LoadAccountByEmailRepository } from '../../protocols/db'
import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher } from './db-add-accounts-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (!account) {
      const hashedPassword = await this.encrypter.hash(accountData.password)
      const addAccountData = Object.assign({}, accountData, { password: hashedPassword })
      return this.addAccountRepository.add(addAccountData)
    }
    return null
  }
}
