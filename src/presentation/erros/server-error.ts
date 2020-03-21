export class ServerError extends Error {
  constructor () {
    super('An error has occurred')
    this.name = 'ServerError'
  }
}
