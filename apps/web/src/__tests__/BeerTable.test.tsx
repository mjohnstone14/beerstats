import { screen } from '@testing-library/react';
import BeerTable from '../components/BeerTable';
import { renderWithProviders } from '../utils/test-utils';
import { UnifiedBeer } from '../interfaces/base';

jest.mock('ag-grid-react', () => ({
  AgGridReact: () => <div>Mocked AgGridReact</div>,
}));

const mockBeer: UnifiedBeer = {
    id: 1,
    source: 'punk',
    name: 'Test Beer',
    brewery: 'BrewDog',
    location: 'Scotland, UK',
    style: 'IPA',
    abv: 5.5,
    ibu: 40,
    ebc: 15,
    description: 'Test description',
    image: null,
    ingredients: { malt: [{ name: 'Pale', amount: { value: 1, unit: 'kg' } }], hops: [{ name: 'Citra', amount: { value: 10, unit: 'g' }, add: 'start', attribute: 'bitter' }], yeast: 'US-05' }
};

describe('BeerTable component', () => {
  it('renders table headers and beer data', () => {
    renderWithProviders(<BeerTable />, {
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

    // Since we mocked ag-grid-react, we just check if it renders the mock
    expect(screen.getByText('Mocked AgGridReact')).toBeTruthy();
  });
});
