import { AddAccountRepository, LoadAccountByEmailRepository } from '../../../../data/protocols/db'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usercases'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const opResult = await accountCollection.insertOne(accountData)
    const account = await MongoHelper.map(opResult.ops[0])
    return new Promise(resolve => resolve(account))
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const opResult = await accountCollection.findOne({ email })
    const account = await MongoHelper.map(opResult)
    return Promise.resolve(account)
  }
}
