import { screen, fireEvent } from '@testing-library/react';
import MyBeersList from '../components/mybeers/MyBeersList';
import { renderWithProviders } from '../utils/test-utils';
import { UnifiedBeer } from '../interfaces/base';

describe('MyBeersList', () => {
  const mockBeer: UnifiedBeer = {
    id: 1, source: 'punk', name: 'My Beer', brewery: 'BrewDog', style: 'IPA',
    abv: 5.5, ibu: 40, description: '', image: null
  };

  const mockOnRemove = jest.fn();
  const mockOnClear = jest.fn();
  const mockOnViewDetail = jest.fn();
  const mockOnViewAnalytics = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when list is empty', () => {
    renderWithProviders(
      <MyBeersList
        list={[]}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
        onViewDetail={mockOnViewDetail}
        onViewAnalytics={mockOnViewAnalytics}
      />
    );

    expect(screen.getByText('Add beers from the search results to build your list')).toBeTruthy();
  });

  it('renders list of beers', () => {
    renderWithProviders(
      <MyBeersList
        list={[mockBeer]}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
        onViewDetail={mockOnViewDetail}
        onViewAnalytics={mockOnViewAnalytics}
      />
    );

    expect(screen.getByText('My Beer')).toBeTruthy();
  });

  it('handles remove click', () => {
    renderWithProviders(
      <MyBeersList
        list={[mockBeer]}
        onRemove={mockOnRemove}
        onClear={mockOnClear}
        onViewDetail={mockOnViewDetail}
        onViewAnalytics={mockOnViewAnalytics}
      />
    );

    const btn = screen.getByLabelText('remove beer');
    fireEvent.click(btn);
    expect(mockOnRemove).toHaveBeenCalledWith(1);
  });
});
