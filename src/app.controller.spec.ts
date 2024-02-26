import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { ServiceTran } from './schema/services.trans.schema';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports:[AppModule],
    })
    .overrideProvider(getModelToken(ServiceTran.name))
    .useValue(jest.fn())
    .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('postOrderActivation', () => {
    it('should return "Hello World!"', async () => {
      const result = await appController.hello();
      expect(result).toBe('Hello World!');
    });
  });
});
