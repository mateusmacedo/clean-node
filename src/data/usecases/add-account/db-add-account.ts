import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-accounts-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const addAccountData = Object.assign({}, accountData, { password: hashedPassword })
    return this.addAccountRepository.add(addAccountData)
  }
}
