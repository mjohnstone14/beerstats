import { screen, fireEvent } from '@testing-library/react';
import BeerSearchPanel from '../components/mybeers/BeerSearchPanel';
import { renderWithProviders } from '../utils/test-utils';
import { UnifiedBeer } from '../interfaces/base';

jest.mock('ag-grid-react', () => ({
  AgGridReact: () => <div>Mocked AgGridReact</div>,
}));

describe('BeerSearchPanel', () => {
  const mockBeer: UnifiedBeer = {
    id: 1, source: 'punk', name: 'Search Beer', brewery: 'BrewDog', style: 'IPA',
    abv: 5.5, ibu: 40, description: '', image: null
  };

  const mockOnQueryChange = jest.fn();
  const mockOnAdd = jest.fn();
  const mockOnViewDetail = jest.fn();
  const mockOnStyleSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input and available results', () => {
    renderWithProviders(
      <BeerSearchPanel
        query="Search"
        onQueryChange={mockOnQueryChange}
        results={[mockBeer]}
        status="succeeded"
        error={null}
        onAdd={mockOnAdd}
        onViewDetail={mockOnViewDetail}
        selectedStyle="All"
        onStyleSelect={mockOnStyleSelect}
        availableStyles={['IPA']}
      />
    );

    expect(screen.getByText('1 beer found')).toBeTruthy();
    expect(screen.getByText('Mocked AgGridReact')).toBeTruthy();
  });

  it('shows loading state', () => {
    renderWithProviders(
      <BeerSearchPanel
        query="Search"
        onQueryChange={mockOnQueryChange}
        results={[]}
        status="loading"
        error={null}
        onAdd={mockOnAdd}
        onViewDetail={mockOnViewDetail}
        selectedStyle="All"
        onStyleSelect={mockOnStyleSelect}
        availableStyles={[]}
      />
    );

    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('shows error state', () => {
    renderWithProviders(
      <BeerSearchPanel
        query="test"
        onQueryChange={mockOnQueryChange}
        results={[]}
        status="failed"
        error="Request failed"
        onAdd={mockOnAdd}
        onViewDetail={mockOnViewDetail}
        selectedStyle="All"
        onStyleSelect={mockOnStyleSelect}
        availableStyles={[]}
      />
    );

    expect(screen.getByText(/Request failed/)).toBeTruthy();
  });

  it('shows empty state when no results', () => {
    renderWithProviders(
      <BeerSearchPanel
        query="xyz"
        onQueryChange={mockOnQueryChange}
        results={[]}
        status="succeeded"
        error={null}
        onAdd={mockOnAdd}
        onViewDetail={mockOnViewDetail}
        selectedStyle="All"
        onStyleSelect={mockOnStyleSelect}
        availableStyles={[]}
      />
    );

    expect(screen.getByText(/No beers found/)).toBeTruthy();
  });

  it('calls onQueryChange when input changes', () => {
    renderWithProviders(
      <BeerSearchPanel
        query=""
        onQueryChange={mockOnQueryChange}
        results={[]}
        status="idle"
        error={null}
        onAdd={mockOnAdd}
        onViewDetail={mockOnViewDetail}
        selectedStyle="All"
        onStyleSelect={mockOnStyleSelect}
        availableStyles={[]}
      />
    );

    const input = screen.getByPlaceholderText(/Search beers/);
    fireEvent.change(input, { target: { value: 'IPA' } });
    expect(mockOnQueryChange).toHaveBeenCalledWith('IPA');
  });

  it('renders style filter chips and handles click', () => {
    renderWithProviders(
      <BeerSearchPanel
        query=""
        onQueryChange={mockOnQueryChange}
        results={[mockBeer]}
        status="succeeded"
        error={null}
        onAdd={mockOnAdd}
        onViewDetail={mockOnViewDetail}
        selectedStyle="All"
        onStyleSelect={mockOnStyleSelect}
        availableStyles={['IPA', 'Stout']}
      />
    );

    const ipaChip = screen.getByText('IPA');
    fireEvent.click(ipaChip);
    expect(mockOnStyleSelect).toHaveBeenCalledWith('IPA');
  });
});
