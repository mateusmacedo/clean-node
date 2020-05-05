import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository,
  Hasher
} from './db-add-accounts-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Hasher, private readonly addAccountRepository: AddAccountRepository) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.hash(accountData.password)
    const addAccountData = Object.assign({}, accountData, { password: hashedPassword })
    return this.addAccountRepository.add(addAccountData)
  }
}
