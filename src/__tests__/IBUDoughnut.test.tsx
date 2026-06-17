import { renderWithProviders } from '../utils/test-utils';
import IBUDoughnut from '../components/IBUDoughnut';
import { UnifiedBeer } from '../interfaces/base';

jest.mock('react-chartjs-2', () => ({
  Doughnut: () => <div>Mocked Doughnut Chart</div>,
}));

describe('IBUDoughnut component', () => {
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
    const { getByText } = renderWithProviders(<IBUDoughnut />, {
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

    expect(getByText('Mocked Doughnut Chart')).toBeTruthy();
  });
});
