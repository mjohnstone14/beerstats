import { screen, fireEvent } from '@testing-library/react';
import BeerDetail from '../components/BeerDetail';
import { renderWithProviders } from '../utils/test-utils';
import { UnifiedBeer } from '../interfaces/base';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

describe('BeerDetail component', () => {
  const mockBeer: UnifiedBeer = {
    id: 1,
    source: 'punk',
    name: 'Test Detail Beer',
    brewery: 'BrewDog',
    location: 'Scotland, UK',
    tagline: 'A hoppy delight',
    style: 'IPA',
    abv: 5.5,
    ibu: 40,
    ebc: 15,
    srm: 7.5,
    ph: 4.4,
    description: 'This is a test beer description',
    image: 'https://images.punkapi.com/v2/keg.png',
    food_pairing: ['Pizza', 'Tacos'],
    brewers_tips: 'Serve cold for best effect.',
    first_brewed: '09/2007',
    ingredients: {
      malt: [{ name: 'Pale', amount: { value: 1, unit: 'kg' } }],
      hops: [{ name: 'Citra', amount: { value: 10, unit: 'g' }, add: 'start', attribute: 'bitter' }],
      yeast: 'US-05'
    }
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders loading state initially if beer not in state', () => {
    renderWithProviders(<BeerDetail />, {
      preloadedState: {
        myBeers: {
          myList: [],
          searchResults: [],
          selectedBeerId: 1,
          searchStatus: 'idle',
          detailStatus: 'loading',
          error: null,
        }
      }
    });

    expect(screen.queryByText('Test Detail Beer')).toBeNull();
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('renders error state when error present and no beer', () => {
    renderWithProviders(<BeerDetail />, {
      preloadedState: {
        myBeers: {
          myList: [],
          searchResults: [],
          selectedBeerId: 1,
          searchStatus: 'idle',
          detailStatus: 'failed',
          error: 'Beer not found',
        }
      }
    });

    expect(screen.getByText('Beer not found')).toBeTruthy();
  });

  it('renders full beer details with all fields', () => {
    renderWithProviders(<BeerDetail />, {
      preloadedState: {
        myBeers: {
          myList: [],
          searchResults: [mockBeer],
          selectedBeerId: 1,
          searchStatus: 'idle',
          detailStatus: 'idle',
          error: null,
        }
      }
    });

    expect(screen.getAllByText('Test Detail Beer').length).toBeGreaterThan(0);
    expect(screen.getByText('This is a test beer description')).toBeTruthy();
    expect(screen.getByText(/A hoppy delight/)).toBeTruthy();
    expect(screen.getByText('5.5%')).toBeTruthy();
    expect(screen.getByText('Pale')).toBeTruthy();
    expect(screen.getByText('Citra')).toBeTruthy();
    expect(screen.getByText('US-05')).toBeTruthy();
    expect(screen.getByText('Pizza')).toBeTruthy();
    expect(screen.getByText(/Serve cold/)).toBeTruthy();
    expect(screen.getByText(/09\/2007/)).toBeTruthy();
  });

  it('shows "Add to My List" when beer not in list', () => {
    renderWithProviders(<BeerDetail />, {
      preloadedState: {
        myBeers: {
          myList: [],
          searchResults: [mockBeer],
          selectedBeerId: 1,
          searchStatus: 'idle',
          detailStatus: 'idle',
          error: null,
        }
      }
    });

    expect(screen.getByText('Add to My List')).toBeTruthy();
  });

  it('shows "Added to My List" when beer is already in list', () => {
    renderWithProviders(<BeerDetail />, {
      preloadedState: {
        myBeers: {
          myList: [mockBeer],
          searchResults: [mockBeer],
          selectedBeerId: 1,
          searchStatus: 'idle',
          detailStatus: 'idle',
          error: null,
        }
      }
    });

    expect(screen.getByText('Added to My List')).toBeTruthy();
  });

  it('renders beer without image using fallback icon', () => {
    const beerNoImage = { ...mockBeer, image: null };
    renderWithProviders(<BeerDetail />, {
      preloadedState: {
        myBeers: {
          myList: [],
          searchResults: [beerNoImage],
          selectedBeerId: 1,
          searchStatus: 'idle',
          detailStatus: 'idle',
          error: null,
        }
      }
    });

    expect(screen.getAllByText('Test Detail Beer').length).toBeGreaterThan(0);
    // Image alt text shouldn't exist since image is null
    expect(screen.queryByAltText('Test Detail Beer')).toBeNull();
  });

  it('navigates to /my-beers when My Beers button clicked', () => {
    renderWithProviders(<BeerDetail />, {
      preloadedState: {
        myBeers: {
          myList: [],
          searchResults: [mockBeer],
          selectedBeerId: 1,
          searchStatus: 'idle',
          detailStatus: 'idle',
          error: null,
        }
      }
    });

    const myBeersButton = screen.getByText('My Beers');
    fireEvent.click(myBeersButton);
    expect(mockNavigate).toHaveBeenCalledWith('/my-beers');
  });

  it('navigates home when mug icon clicked', () => {
    renderWithProviders(<BeerDetail />, {
      preloadedState: {
        myBeers: {
          myList: [],
          searchResults: [mockBeer],
          selectedBeerId: 1,
          searchStatus: 'idle',
          detailStatus: 'idle',
          error: null,
        }
      }
    });

    const homeIcon = screen.getByAltText('Home');
    fireEvent.click(homeIcon);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders beer found in myList when not in searchResults', () => {
    renderWithProviders(<BeerDetail />, {
      preloadedState: {
        myBeers: {
          myList: [mockBeer],
          searchResults: [],
          selectedBeerId: 1,
          searchStatus: 'idle',
          detailStatus: 'idle',
          error: null,
        }
      }
    });

    expect(screen.getAllByText('Test Detail Beer').length).toBeGreaterThan(0);
  });
});
