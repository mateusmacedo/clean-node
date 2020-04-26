import { LogErrorRepository } from '../../data/protocols/db'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepository: LogErrorRepository

  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handler (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handler(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return new Promise(resolve => resolve(httpResponse))
  }
}
