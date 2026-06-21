import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
    // Initialize the module to call onModuleInit
    await service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchBeers', () => {
    it('should return combined beers from local json and Punk API', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [
          {
            id: 1,
            name: 'Buzz',
            tagline: 'A Real Bitter Experience.',
            abv: 4.5,
            ibu: 60,
            description: 'A light, crisp and bitter IPA.',
            image_url: null,
            ingredients: { malt: [], hops: [], yeast: 'Wyeast 1056' },
            food_pairing: [],
            brewers_tips: '',
            first_brewed: '',
          },
        ],
      });

      const results = await service.searchBeers('Buzz');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toBe('Buzz');
      expect(results[0].source).toBe('punk');
    });
  });

  describe('getBeerById', () => {
    it('should return a Punk API beer if id is numeric', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          id: 1,
          name: 'Buzz',
          tagline: 'A Real Bitter Experience.',
          abv: 4.5,
          ibu: 60,
          description: 'A light, crisp and bitter IPA.',
          image_url: null,
          ingredients: { malt: [], hops: [], yeast: 'Wyeast 1056' },
          food_pairing: [],
          brewers_tips: '',
          first_brewed: '',
        },
      });

      const result = await service.getBeerById(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.source).toBe('punk');
    });
  });
});
