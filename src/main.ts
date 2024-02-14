import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);


  app.setGlobalPrefix('/mobile/tigo/hn/digital/api/v1');

  // app.useGlobalPipes(new ValidationPipe({
  //   //with list solo deja la data que espero aunque enviemos otra data
  //   whitelist:true,
  //   //No deja pasar data no delclarada en la clase
  //   forbidNonWhitelisted:true
  // }))


  await app.listen(3000);
}
bootstrap();
