import bcrypt from 'bcrypt'

import { HashCompare, Hasher } from '../../data/protocols/criptography'

export class BcryptAdapter implements Hasher, HashCompare {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt)
    return new Promise(resolve => resolve(hashedValue))
  }

  async compare (value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash)
    return Promise.resolve(true)
  }
}
