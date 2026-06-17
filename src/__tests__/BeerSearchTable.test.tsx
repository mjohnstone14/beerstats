import { screen } from '@testing-library/react';
import BeerSearchTable from '../components/mybeers/BeerSearchTable';
import { renderWithProviders } from '../utils/test-utils';
import { UnifiedBeer } from '../interfaces/base';

jest.mock('ag-grid-react', () => ({
  AgGridReact: () => <div>Mocked AgGridReact</div>,
}));

describe('BeerSearchTable', () => {
  const mockBeer: UnifiedBeer = {
    id: 1, source: 'punk', name: 'Search Table Beer', brewery: 'BrewDog', style: 'IPA',
    abv: 5.5, ibu: 40, description: '', image: null
  };

  const mockOnAdd = jest.fn();
  const mockOnViewDetail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with results', () => {
    renderWithProviders(
      <BeerSearchTable
        searchResults={[mockBeer]}
        onAdd={mockOnAdd}
        onViewDetail={mockOnViewDetail}
      />
    );

    expect(screen.getByText('Mocked AgGridReact')).toBeTruthy();
  });

  it('renders empty state when no results', () => {
    renderWithProviders(
      <BeerSearchTable
        searchResults={[]}
        onAdd={mockOnAdd}
        onViewDetail={mockOnViewDetail}
      />
    );

    expect(screen.getByText(/No beers found matching your search./i)).toBeTruthy();
  });
});
