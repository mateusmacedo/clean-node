export class EmailAlreadyInUseError extends Error {
  readonly stack: string

  constructor () {
    super('Email already in use')
    this.name = 'EmailAlreadyInUseError'
  }
}
