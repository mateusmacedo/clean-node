export class UnauthorizedError extends Error {
  readonly stack: string

  constructor () {
    super('unauthorized')
    this.name = 'UnauthorizedError'
  }
}
