import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;
  let controller: AppController;
  let service: AppService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            searchBeers: jest.fn().mockResolvedValue([{ id: 1, name: 'Buzz', source: 'punk' }]),
            getBeerById: jest.fn().mockResolvedValue({ id: 1, name: 'Buzz', source: 'punk' }),
          },
        },
      ],
    }).compile();

    controller = app.get<AppController>(AppController);
    service = app.get<AppService>(AppService);
  });

  describe('searchBeers', () => {
    it('should return service search results', async () => {
      const results = await controller.searchBeers('Buzz');
      expect(results).toEqual([{ id: 1, name: 'Buzz', source: 'punk' }]);
      expect(service.searchBeers).toHaveBeenCalledWith('Buzz');
    });
  });

  describe('getBeerById', () => {
    it('should return service beer details', async () => {
      const result = await controller.getBeerById('1');
      expect(result).toEqual({ id: 1, name: 'Buzz', source: 'punk' });
      expect(service.getBeerById).toHaveBeenCalledWith('1');
    });
  });
});
