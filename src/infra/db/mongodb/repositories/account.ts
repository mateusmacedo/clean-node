import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AddAccountModel } from '../../../../domain/usercases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const opResult = await accountCollection.insertOne(accountData)
    const accountMongoObj = opResult.ops[0]
    const { _id, ...accountWithOutId } = accountMongoObj
    const account = Object.assign({}, accountWithOutId, { id: _id })
    return new Promise(resolve => resolve(account))
  }
}
