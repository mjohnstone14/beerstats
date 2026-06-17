import App from "../components/App"
import { screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { renderWithProviders } from "../utils/test-utils"

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('App component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders welcome message', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('Welcome friend, to Beer Stats!')).toBeTruthy();
  });

  test('renders Browse Beers button and navigates', () => {
    renderWithProviders(<App />);
    const browseBtn = screen.getByText('Browse Beers');
    expect(browseBtn).toBeTruthy();
    fireEvent.click(browseBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/my-beers');
  });

  test('renders View Analytics disabled when list is empty', () => {
    renderWithProviders(<App />, {
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
    const analyticsBtn = screen.getByText('View Analytics (Add beers first)');
    expect(analyticsBtn).toBeDisabled();
  });

  test('renders View Analytics enabled and navigates when list has items', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        myBeers: {
          myList: [{ id: 1, name: 'Test' } as any],
          searchResults: [],
          selectedBeerId: null,
          searchStatus: 'idle',
          detailStatus: 'idle',
          error: null,
        }
      }
    });
    const analyticsBtn = screen.getByText('View Analytics (1)');
    expect(analyticsBtn).not.toBeDisabled();
    fireEvent.click(analyticsBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});