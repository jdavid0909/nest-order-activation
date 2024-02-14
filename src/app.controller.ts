import { Body, Controller, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { RootDto } from './dto/order.activation.dto';

@Controller('orders')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post()
  postOrderActivation(@Res() res, @Body() body: RootDto) {

    return this.appService.logicService(res, body);

    
  }
}
