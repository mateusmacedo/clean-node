export class ServerError extends Error {
  readonly stack: string

  constructor (stack: string) {
    super('Internal Server Error')
    this.name = 'ServerError'
    this.stack = stack
  }
}
