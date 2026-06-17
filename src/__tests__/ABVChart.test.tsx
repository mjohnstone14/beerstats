import { renderWithProviders } from '../utils/test-utils';
import ABVChart from '../components/ABVChart';
import { UnifiedBeer } from '../interfaces/base';

// We need to mock react-chartjs-2 because canvas is not supported in jsdom
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div>Mocked Bar Chart</div>,
}));

describe('ABVChart component', () => {
  const mockBeer: UnifiedBeer = {
    id: 1,
    source: 'punk',
    name: 'Test Beer',
    brewery: 'BrewDog',
    style: 'IPA',
    abv: 5.5,
    ibu: 40,
    ebc: 15,
    description: 'Test description',
    image: null
  };

  it('renders chart without crashing', () => {
    const { getByText } = renderWithProviders(<ABVChart />, {
      preloadedState: {
        myBeers: {
          myList: [mockBeer],
          searchResults: [],
          selectedBeerId: null,
          searchStatus: 'idle',
          detailStatus: 'idle',
          error: null,
        }
      }
    });

    expect(getByText('Mocked Bar Chart')).toBeTruthy();
  });
});
