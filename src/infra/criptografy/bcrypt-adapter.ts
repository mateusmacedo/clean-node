import bcrypt from 'bcrypt'

import { HashCompare, Hasher } from '../../data/protocols/criptography'

export class BcryptAdapter implements Hasher, HashCompare {
  constructor (private readonly salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt)
    return Promise.resolve(hashedValue)
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const compareResult = await bcrypt.compare(value, hash)
    return Promise.resolve(compareResult)
  }
}
