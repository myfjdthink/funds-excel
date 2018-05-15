import {Get, Controller, Response} from '@nestjs/common'
import {AppService} from './app.service'

@Controller()
export class AppController {
  constructor (private readonly appService: AppService) {
  }

  @Get('/funds')
  async funds (): Promise<object> {
    return await this.appService.downData(1)
  }

  @Get('/excel')
  async excel (@Response() res) {
    const filePath = await this.appService.downExcel()
    res.download(filePath)
  }
}
