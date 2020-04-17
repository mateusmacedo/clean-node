import { AccountModel } from '../../domain/models/account'
import { AddAccountModel } from '../../domain/usercases'

export interface AddAccountRepository {
  add (account: AddAccountModel): Promise<AccountModel>
}
