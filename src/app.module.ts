import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { ServiceTran, ServiceTranSchema } from './schema/services.trans.schema';
import { ServiceSku, ServiceSkuSchema } from './schema/services.sku';
import { KafkaService } from './kafka/consumer.service';

@Module({
  imports: [

    

    MongooseModule.forRoot('mongodb://localhost:27017/nest-digital'), 
    MongooseModule.forFeature([{
      name: ServiceTran.name,
      schema: ServiceTranSchema
    },
    {
      name: ServiceSku.name,
      schema: ServiceSkuSchema
    },
  ])
  ],
  controllers: [AppController],
  providers: [AppService,KafkaService],
})
export class AppModule {}
