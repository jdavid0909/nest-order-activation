import { validateOrReject, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { RootDto } from './dto/order.activation.dto';
import { Utils } from './utils/utils';

@Injectable()
export class AppService {

  private utils: Utils = new Utils();

  
  async logicService(res: Response, body: any) {
    try {
      const rootDto: RootDto = plainToClass(RootDto, body);
      await validateOrReject(rootDto, { skipMissingProperties: false });
      return res.status(200).json({ message: 'La validación fue exitosa' });
    } catch (error) {
      if (error instanceof Array && error.every(err => err instanceof ValidationError)) {

        const validationErrors = this.utils.extractValidationErrors(error);
        return res.status(400).json({ message: 'Error de validación', errors: validationErrors[0].constraints.split(" ")[0] });
      } else {
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
    }
  }

 
}