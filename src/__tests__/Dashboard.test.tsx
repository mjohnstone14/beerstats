import { screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';
import { renderWithProviders } from '../utils/test-utils';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('ag-grid-react', () => ({
  AgGridReact: () => <div>Mocked AgGridReact</div>,
}));

describe('Dashboard component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('navigates home if myList is empty', () => {
    renderWithProviders(<Dashboard />, {
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

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders analytics components when myList has items', () => {
    const mockBeer = {
      id: 1, name: 'Test', style: 'IPA', abv: 5.5, ibu: 40, ebc: 15,
      ingredients: { hops: [{ name: 'Citra', amount: { value: 10, unit: 'g' }, add: 'start', attribute: 'bitter' }] }
    } as any;

    renderWithProviders(<Dashboard />, {
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

    expect(screen.getByText('Analytics on your 1 brews')).toBeTruthy();
  });
});
