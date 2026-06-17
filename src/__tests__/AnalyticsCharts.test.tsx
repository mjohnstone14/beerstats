import { renderWithProviders } from '../utils/test-utils';
import ABVvsIBUScatter from '../components/analytics/ABVvsIBUScatter';
import StyleDoughnut from '../components/analytics/StyleDoughnut';
import TopHopsChart from '../components/analytics/TopHopsChart';
import ColorSpectrumChart from '../components/analytics/ColorSpectrumChart';
import { UnifiedBeer } from '../interfaces/base';

jest.mock('react-chartjs-2', () => ({
  Scatter: () => <div>Mocked Scatter Chart</div>,
  Doughnut: () => <div>Mocked Doughnut Chart</div>,
  Bar: () => <div>Mocked Bar Chart</div>,
}));

describe('Analytics components', () => {
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
    image: null,
    ingredients: { malt: [], hops: [{ name: 'Citra', amount: { value: 10, unit: 'g' }, add: 'start', attribute: 'bitter' }], yeast: 'US-05' }
  };

  it('renders ABVvsIBUScatter without crashing', () => {
    const { getByText } = renderWithProviders(<ABVvsIBUScatter />, { preloadedState: { myBeers: { myList: [mockBeer] } as any } });
    expect(getByText('Mocked Scatter Chart')).toBeTruthy();
  });

  it('renders StyleDoughnut without crashing', () => {
    const { getByText } = renderWithProviders(<StyleDoughnut />, { preloadedState: { myBeers: { myList: [mockBeer] } as any } });
    expect(getByText('Mocked Doughnut Chart')).toBeTruthy();
  });

  it('renders TopHopsChart without crashing', () => {
    const { getByText } = renderWithProviders(<TopHopsChart />, { preloadedState: { myBeers: { myList: [mockBeer] } as any } });
    expect(getByText('Mocked Bar Chart')).toBeTruthy();
  });

  it('renders ColorSpectrumChart without crashing', () => {
    const { getByText } = renderWithProviders(<ColorSpectrumChart />, { preloadedState: { myBeers: { myList: [mockBeer] } as any } });
    expect(getByText('Mocked Bar Chart')).toBeTruthy();
  });
});
