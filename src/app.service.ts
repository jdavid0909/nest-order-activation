import { validateOrReject, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { RootDto } from './dto/order.activation.dto';
import { Utils } from './utils/utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceTran } from './schema/services.trans.schema';
import { ServiceSku } from './schema/services.sku';
import { KafkaService } from './kafka/consumer.service';
import { logging } from 'npm-logging-ts';

@Injectable()
export class AppService {

  private utils: Utils = new Utils();


  constructor(
    @InjectModel(ServiceTran.name)
    private readonly serviceTrans: Model<ServiceTran>,
    @InjectModel(ServiceSku.name)
    private readonly serviceSku: Model<ServiceSku>,
    private readonly kafkaService: KafkaService
  ) {

  }


  async logicService(res: Response, body: RootDto, crmSystem: String, uti: string) {


    const action = body.input.included.newInstance.included.orderItems[0].attributes.action.toLocaleLowerCase();
    const offerName = body.input.included.newInstance.included.orderItems[0].attributes.reason.name;
    const subscriber = body.input.included.newInstance.relationships.customerAccountId;
    const offerId = body.input.included.newInstance.included.orderItems[0].included.orderProduct.relationships.productOfferingId;

    try {

      const { skusymph } = await this.serviceSku.findOne({ offerid: +offerId })

      const registre = await this.serviceTrans.findOne({
        $and: [{ unit: crmSystem }, { subscriber: subscriber },
        { offerId: offerId }, { typeTrans: 'IN PROGRESS' }, { status: 1 }]
      });

      if (registre == null) {

        if (action === 'add') {

          const data = {

            subscriber: subscriber,
            offerId: offerId,
            status: 1,
            offerName: offerName,
            transactionState: 'OK',
            retires: 0,
            typeTrans: 'IN PROGRESS',
            changeOffer: 'FALSE',
            unit: crmSystem,
            transactionId: uti,
            skusymph: skusymph

          }

          const serviceTransSave = await new this.serviceTrans(data);

          await serviceTransSave.save();

          const msgKafka = {
            serviceOrder: {
              action: "ADD",
              uti: uti,
              consumerId: 33,
              subscriber: subscriber,
              unit: crmSystem
            },
            details: [
              {
                key: "productid",
                value: offerId
              }
            ]
          }

          await this.kafkaService.send('test',msgKafka, uti);

        } else if (action === 'modify') {

          const data = {

            subscriber: subscriber,
            offerId: offerId,
            status: 1,
            offerName: offerName,
            transactionState: 'OK',
            retires: 0,
            typeTrans: 'IN PROGRESS',
            changeOffer: 'FALSE',
            unit: crmSystem,
            transactionId: uti,
            skusymph: skusymph

          }

          const serviceTransSave = await new this.serviceTrans(data);


          await serviceTransSave.save();

          const msgKafka = {
            serviceOrder: {
              action: "MODIFY",
              uti: uti,
              consumerId: 33,
              subscriber: subscriber,
              unit: crmSystem
            },
            details: [
              {
                key: "productid",
                value: offerId
              }
            ]
          }

          await this.kafkaService.send('test',msgKafka, uti);


        } else if (action === 'remove') {


          const registreActivo = await this.serviceTrans.findOne({
            $and: [{ offerId: offerId }, { status: 1 }]
          });

          if (registreActivo == null) {

            return res.status(400).json({
              generalResponse: {
                uti: uti,
                status: "ERROR",
                code: "601",
                message: `Error no existe registro activo para remover`
              }
            });

          }

          const data = {

            subscriber: subscriber,
            offerId: offerId,
            status: 1,
            offerName: offerName,
            transactionState: 'OK',
            retires: 0,
            typeTrans: 'IN PROGRESS',
            changeOffer: 'FALSE',
            unit: crmSystem,
            transactionId: uti,
            skusymph: skusymph

          }

          const serviceTransSave = await new this.serviceTrans(data);


          await serviceTransSave.save();

          const msgKafka = {
            serviceOrder: {
              action: "REMOVE",
              uti: uti,
              consumerId: 33,
              subscriber: subscriber,
              unit: crmSystem
            },
            details: [
              {
                key: "productid",
                value: offerId
              }
            ]
          }

          await this.kafkaService.send('test',msgKafka, uti);


        } else {

          logging.business(
            'Order Activation',
            'Error al consumir Order Activation',
            {
              generalResponse: {
                uti: uti,
                status: "ERROR",
                code: "601",
                message: `Error action Invalid Data`
              }
            },
          );
          return res.status(400).json({
            generalResponse: {
              uti: uti,
              status: "ERROR",
              code: "601",
              message: `Error action Invalid Data`
            }
          });
        }

        logging.business(
          'Order Activation',
          'Success al consumir Order Activation',
          {
            generalResponse: {
              uti: uti,
              status: "OK",
              code: "01",
              message: `Service Complete`
            }
          },
        );


        return res.status(200).json({
          generalResponse: {
            uti: uti,
            status: "OK",
            code: "01",
            message: `Service Complete`
          }
        });


      } else {

        return res.status(400).json({
          generalResponse: {
            uti: uti,
            status: "ERROR",
            code: "601",
            message: `Ya existe un registro en la bd`
          }
        });

      }

    } catch (error) {

      console.log(error);

    }
  }


}