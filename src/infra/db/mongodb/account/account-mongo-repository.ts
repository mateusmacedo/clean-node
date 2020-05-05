import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccountAccessTokenRepository
} from '../../../../data/protocols/db'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usercases'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccountAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const opResult = await accountCollection.insertOne(accountData)
    const account = await MongoHelper.map(opResult.ops[0])
    return new Promise(resolve => resolve(account))
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const opResult = await accountCollection.findOne({ email })
    if (opResult) {
      const account = await MongoHelper.map(opResult)
      return Promise.resolve(account)
    }
  }

  async updateAccessToken (id: string, accessToken: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
  }
}
