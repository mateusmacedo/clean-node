import { Request, Response } from 'express'
import { Controller, HttpRequest } from '../../presentation/protocols'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const okCodes = [200, 201]
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handler(httpRequest)
    const isSuccess = okCodes.some((code) => {
      return code === httpResponse.statusCode
    })
    if (isSuccess) {
      res.status(httpResponse.statusCode)
        .json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode)
        .json({ error: httpResponse.body.message })
    }
  }
}
