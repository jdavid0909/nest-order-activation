import { Body, Controller, Header, Headers, Logger, ParseIntPipe, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { RootDto } from './dto/order.activation.dto';
import { ValidationError, validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Utils } from './utils/utils';


import { v4 as uuid } from "uuid";
import { logging } from 'npm-logging-ts';
@Controller('orders')
export class AppController {


  private logger = new Logger('AppController');

  constructor(private readonly appService: AppService) { }


  private utils: Utils = new Utils();

  @Post()
  async postOrderActivation(@Res() res,
    @Headers('crmSystem') crmSystem: string,
    @Headers('consumer') consumer: string,
    @Body() body: RootDto) {

    const uti = uuid();

    try {

      this.utils.ValidHeaderStringAndEmpy(res, uti,
        {
          clave: 'crmSystem',
          valor: crmSystem
        },
        {
          clave: 'consumer',
          valor: consumer
        });

      const rootDto: RootDto = plainToClass(RootDto, body);
      await validateOrReject(rootDto, { skipMissingProperties: false });

      const service = await this.appService.logicService(res, body,crmSystem,uti);

      return service

    } catch (error) {

      this.logger.error(error)

      if (error instanceof Array && error.every(err => err instanceof ValidationError)) {

        const validationErrors = this.utils.extractValidationErrors(error);

        return res.status(400).json({
          generalResponse: {
            uti: uti,
            status: "ERROR",
            code: "601",
            message: `Error ${validationErrors[0].constraints.split(" ")[0]} Invalid Data`
          }
        });
      } else {
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
    }

  }
}
