import { screen, fireEvent } from '@testing-library/react';
import MyBeers from '../components/MyBeers';
import { renderWithProviders } from '../utils/test-utils';
import { UnifiedBeer } from '../interfaces/base';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('ag-grid-react', () => ({
  AgGridReact: () => <div>Mocked AgGridReact</div>,
}));

// Mock axios to prevent real API calls
jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({ data: [] }),
}));

describe('MyBeers component', () => {
  const mockBeer: UnifiedBeer = {
    id: 1, source: 'punk', name: 'Test Beer', brewery: 'BrewDog',
    style: 'IPA', abv: 5.5, ibu: 40, description: '', image: null,
  };
  const mockBeer2: UnifiedBeer = {
    id: 2, source: 'punk', name: 'Test Beer 2', brewery: 'BrewDog',
    style: 'Stout', abv: 7.0, ibu: 30, description: '', image: null,
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders correctly and dispatches initial search', () => {
    renderWithProviders(<MyBeers />);
    expect(screen.getByText('My Beers')).toBeTruthy();
  });

  it('navigates home when mug icon is clicked', () => {
    renderWithProviders(<MyBeers />);
    const mug = screen.getByAltText('Home');
    fireEvent.click(mug);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders my list panel with beers', () => {
    renderWithProviders(<MyBeers />, {
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

    // My list should show the beer name
    expect(screen.getByText('Test Beer')).toBeTruthy();
    expect(screen.getByText('My List')).toBeTruthy();
  });

  it('shows empty list state when no beers added', () => {
    renderWithProviders(<MyBeers />, {
      preloadedState: {
        myBeers: {
          myList: [],
          searchResults: [],
          selectedBeerId: null,
          searchStatus: 'idle',
          detailStatus: 'idle',
          error: null,
        }
      }
    });

    expect(screen.getByText(/Add beers from the search results/)).toBeTruthy();
  });

  it('handles search input change', () => {
    renderWithProviders(<MyBeers />);

    const input = screen.getByPlaceholderText(/Search beers/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'IPA' } });
    expect(input.value).toBe('IPA');
  });

  it('disables View Analytics with fewer than 2 beers', () => {
    renderWithProviders(<MyBeers />, {
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

    const analyticsBtn = screen.getByText(/View Analytics/).closest('button');
    expect(analyticsBtn?.hasAttribute('disabled')).toBe(true);
  });

  it('enables View Analytics with 2+ beers and navigates on click', () => {
    renderWithProviders(<MyBeers />, {
      preloadedState: {
        myBeers: {
          myList: [mockBeer, mockBeer2],
          searchResults: [],
          selectedBeerId: null,
          searchStatus: 'idle',
          detailStatus: 'idle',
          error: null,
        }
      }
    });

    const analyticsBtn = screen.getByText(/View Analytics/).closest('button')!;
    expect(analyticsBtn.hasAttribute('disabled')).toBe(false);
    fireEvent.click(analyticsBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('removes a beer from the list', () => {
    const { store } = renderWithProviders(<MyBeers />, {
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

    const removeBtn = screen.getByLabelText('remove beer');
    fireEvent.click(removeBtn);
    expect(store.getState().myBeers.myList).toHaveLength(0);
  });
});
