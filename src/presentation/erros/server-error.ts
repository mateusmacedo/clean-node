export class ServerError extends Error {
  readonly stack: string

  constructor (stack: string) {
    super('An error has occurred')
    this.name = 'ServerError'
    this.stack = stack
  }
}
