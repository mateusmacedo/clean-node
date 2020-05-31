import { LogMongoRepository } from '../../../infra/db/mongodb'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeLogControllerDecorator = (controller): Controller => {
  return new LogControllerDecorator(controller, new LogMongoRepository())
}
