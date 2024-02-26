import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { ServiceTran, ServiceTranSchema } from './schema/services.trans.schema';
import { ServiceSku, ServiceSkuSchema } from './schema/services.sku';
import { KafkaService } from './kafka/consumer.service';
import { HttpInterceptor, LoggerMiddleware } from 'npm-logging-ts';
import { APP_INTERCEPTOR } from '@nestjs/core';

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
  providers: [AppService, KafkaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('/mobile/tigo/hn/digital/api/v1');
  }
}
