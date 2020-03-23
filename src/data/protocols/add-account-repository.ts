import { AddAccountModel } from '../../domain/usercases/add-account'
import { AccountModel } from '../../domain/models/account'

export interface AddAccountRepository {
  add (account: AddAccountModel): Promise<AccountModel>
}
