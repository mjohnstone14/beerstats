import reducer, {
  addToMyList,
  removeFromMyList,
  clearMyList,
  setSelectedBeerId,
  clearSearch,
  getBeerStyle,
  punkToUnified,
  beerToBeerObject,
  searchAllBeers,
  loadBeerById
} from '../features/myBeersSlice';
import { UnifiedBeer, PunkBeer } from '../interfaces/base';

jest.mock('axios', () => {
  const mockCraftBeers = [
    {
      id: 'craft-1',
      source: 'craft',
      name: "Devil's Cup",
      brewery: 'SingleCut Beersmiths',
      style: 'IPA',
      abv: 6.6,
      ibu: 66,
      description: 'Test Devil\'s Cup',
    }
  ];
  return {
    get: jest.fn().mockImplementation((url, config) => {
      if (url === '/api/beers') {
        const query = config?.params?.search?.toLowerCase() || '';
        const filtered = mockCraftBeers.filter(b => 
          b.name.toLowerCase().includes(query) || 
          b.brewery.toLowerCase().includes(query)
        );
        return Promise.resolve({ data: filtered });
      }
      if (url.startsWith('/api/beers/')) {
        const id = url.split('/').pop();
        if (id === 'craft-nonexistent') {
          return Promise.reject({ response: { status: 404 } });
        }
        const beer = mockCraftBeers.find(b => String(b.id) === String(id));
        if (beer) {
          return Promise.resolve({ data: beer });
        }
        return Promise.reject({ response: { status: 404 } });
      }
      return Promise.resolve({ data: [] });
    }),
    isCancel: (err: any) => err?.__cancel === true,
  };
});

describe('myBeersSlice', () => {
  const initialState = {
    searchResults: [],
    myList: [],
    selectedBeerId: null,
    searchStatus: 'idle' as const,
    detailStatus: 'idle' as const,
    error: null,
  };

  const mockBeer: UnifiedBeer = {
    id: 1,
    source: 'punk',
    name: 'Test Beer',
    brewery: 'BrewDog',
    location: 'Scotland, UK',
    tagline: 'A nice test beer',
    style: 'IPA',
    abv: 5.5,
    ibu: 40,
    ebc: 15,
    srm: 7.5,
    ph: 4.4,
    description: 'Test description',
    image: null,
    food_pairing: ['Pizza'],
    brewers_tips: 'Drink cold',
    first_brewed: '01/2000',
    ingredients: { malt: [], hops: [], yeast: 'ale' }
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addToMyList', () => {
    const actual = reducer(initialState, addToMyList(mockBeer));
    expect(actual.myList).toHaveLength(1);
    expect(actual.myList[0]).toEqual(mockBeer);
    
    // Test duplicate prevention
    const actual2 = reducer(actual, addToMyList(mockBeer));
    expect(actual2.myList).toHaveLength(1);
  });

  it('should handle removeFromMyList', () => {
    const stateWithBeer = { ...initialState, myList: [mockBeer] };
    const actual = reducer(stateWithBeer, removeFromMyList(1));
    expect(actual.myList).toHaveLength(0);
  });

  it('should handle clearMyList', () => {
    const stateWithBeer = { ...initialState, myList: [mockBeer] };
    const actual = reducer(stateWithBeer, clearMyList());
    expect(actual.myList).toHaveLength(0);
  });

  it('should handle setSelectedBeerId', () => {
    const actual = reducer(initialState, setSelectedBeerId(5));
    expect(actual.selectedBeerId).toEqual(5);
  });

  it('should handle clearSearch', () => {
    const stateWithSearch = {
      ...initialState,
      searchResults: [mockBeer],
      searchStatus: 'succeeded' as const,
      error: 'some error'
    };
    const actual = reducer(stateWithSearch, clearSearch());
    expect(actual.searchResults).toEqual([]);
    expect(actual.searchStatus).toEqual('idle');
    expect(actual.error).toBeNull();
  });
});

describe('myBeersSlice Helpers', () => {
  it('getBeerStyle', () => {
    expect(getBeerStyle({ name: 'Hop', tagline: 'India Pale Ale' } as any)).toBe('IPA');
    expect(getBeerStyle({ name: 'Dark', tagline: 'Stout' } as any)).toBe('Stout');
    expect(getBeerStyle({ name: 'Unknown', tagline: '' } as any)).toBe('Other');
  });

  it('punkToUnified', () => {
    const punk: PunkBeer = {
      id: 5,
      name: 'Hop Rocker',
      tagline: 'Lager',
      first_brewed: '04/2007',
      description: 'Test',
      image_url: 'url',
      abv: 5,
      ibu: 40,
      ebc: 10,
      srm: 5,
      ph: 4.4,
      attenuation_level: 80,
      volume: { value: 20, unit: 'litres' },
      boil_volume: { value: 25, unit: 'litres' },
      method: { mash_temp: [], fermentation: { temp: { value: 20, unit: 'celsius' } }, twist: null },
      ingredients: { malt: [], hops: [], yeast: 'Wyeast' },
      food_pairing: [],
      brewers_tips: 'Drink it',
      contributed_by: 'Sam'
    };
    const unified = punkToUnified(punk);
    expect(unified.id).toBe(5);
    expect(unified.style).toBe('Lager');
  });

  it('beerToBeerObject', () => {
    const unified: UnifiedBeer = {
      id: 'craft-1',
      source: 'craft',
      name: 'Test',
      brewery: 'Test',
      location: 'Test',
      style: 'IPA',
      abv: 5.5,
      ibu: 40,
      ebc: 10,
      description: '',
      image: null,
      ingredients: { malt: [{ name: 'Pale', amount: { value: 1, unit: 'kg' } }], hops: [{ name: 'Citra', amount: { value: 10, unit: 'g' }, add: 'start', attribute: 'bitter' }], yeast: 'US-05' }
    };
    const obj = beerToBeerObject(unified);
    expect(obj.id).toBe(1);
    expect(obj.uid).toBe('craft-1');
    expect(obj.malts).toBe('Pale');
    expect(obj.hop).toBe('Citra');
  });

  it('beerToBeerObject handles missing ingredients', () => {
    const unified: UnifiedBeer = {
      id: 10,
      source: 'punk',
      name: 'No Ingredients',
      brewery: 'BrewDog',
      style: 'IPA',
      abv: null,
      ibu: null,
      description: '',
      image: null,
    };
    const obj = beerToBeerObject(unified);
    expect(obj.malts).toBe('—');
    expect(obj.hop).toBe('—');
    expect(obj.yeast).toBe('—');
    expect(obj.ibu).toBe('0 IBU');
    expect(obj.alcohol).toBe('0%');
    expect(obj.blg).toBe('—');
  });
});

describe('myBeersSlice async thunks (extra reducers)', () => {
  const initialState = {
    searchResults: [],
    myList: [],
    selectedBeerId: null,
    searchStatus: 'idle' as const,
    detailStatus: 'idle' as const,
    error: null,
  };

  const mockBeer: UnifiedBeer = {
    id: 1, source: 'punk', name: 'Test', brewery: 'BrewDog',
    style: 'IPA', abv: 5, ibu: 40, description: '', image: null,
  };

  it('searchAllBeers.pending sets loading', () => {
    const action = { type: searchAllBeers.pending.type };
    const state = reducer(initialState, action);
    expect(state.searchStatus).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('searchAllBeers.fulfilled sets results', () => {
    const action = { type: searchAllBeers.fulfilled.type, payload: [mockBeer] };
    const state = reducer(initialState, action);
    expect(state.searchStatus).toBe('succeeded');
    expect(state.searchResults).toEqual([mockBeer]);
  });

  it('searchAllBeers.rejected sets error', () => {
    const action = { type: searchAllBeers.rejected.type, error: { message: 'Network error' } };
    const state = reducer(initialState, action);
    expect(state.searchStatus).toBe('failed');
    expect(state.error).toBe('Network error');
  });

  it('searchAllBeers.rejected uses fallback message', () => {
    const action = { type: searchAllBeers.rejected.type, error: {} };
    const state = reducer(initialState, action);
    expect(state.error).toBe('Failed to fetch beers');
  });

  it('searchAllBeers.rejected ignores abort action', () => {
    const action = {
      type: searchAllBeers.rejected.type,
      error: { message: 'Aborted' },
      meta: { aborted: true },
    };
    const state = reducer(initialState, action);
    expect(state.searchStatus).toBe('idle');
    expect(state.error).toBeNull();
  });

  it('loadBeerById.pending sets loading', () => {
    const action = { type: loadBeerById.pending.type };
    const state = reducer(initialState, action);
    expect(state.detailStatus).toBe('loading');
  });

  it('loadBeerById.fulfilled adds to searchResults', () => {
    const action = { type: loadBeerById.fulfilled.type, payload: mockBeer };
    const state = reducer(initialState, action);
    expect(state.detailStatus).toBe('succeeded');
    expect(state.searchResults).toContainEqual(mockBeer);
  });

  it('loadBeerById.fulfilled does not duplicate existing beer', () => {
    const stateWithBeer = { ...initialState, searchResults: [mockBeer] };
    const action = { type: loadBeerById.fulfilled.type, payload: mockBeer };
    const state = reducer(stateWithBeer, action);
    expect(state.searchResults).toHaveLength(1);
  });

  it('loadBeerById.rejected sets error', () => {
    const action = { type: loadBeerById.rejected.type, error: { message: 'Not found' } };
    const state = reducer(initialState, action);
    expect(state.detailStatus).toBe('failed');
    expect(state.error).toBe('Not found');
  });

  it('loadBeerById.rejected uses fallback message', () => {
    const action = { type: loadBeerById.rejected.type, error: {} };
    const state = reducer(initialState, action);
    expect(state.error).toBe('Failed to load beer');
  });

  it('loadBeerById.rejected ignores abort action', () => {
    const action = {
      type: loadBeerById.rejected.type,
      error: { message: 'Aborted' },
      meta: { aborted: true },
    };
    const state = reducer(initialState, action);
    expect(state.detailStatus).toBe('idle');
    expect(state.error).toBeNull();
  });
});

describe('myBeersSlice async thunks direct execution', () => {
  it('searchAllBeers with query filters craft beers', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const resultAction = await searchAllBeers("Devil's Cup")(dispatch, getState, undefined);
    
    expect(searchAllBeers.fulfilled.match(resultAction)).toBe(true);
    const payload = resultAction.payload as UnifiedBeer[];
    const devilsCup = payload.find(b => b.name === "Devil's Cup");
    expect(devilsCup).toBeDefined();
    expect(devilsCup?.source).toBe('craft');
  });

  it('loadBeerById with craft- ID returns local beer', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const resultAction = await loadBeerById('craft-1')(dispatch, getState, undefined);
    
    expect(loadBeerById.fulfilled.match(resultAction)).toBe(true);
    const payload = resultAction.payload as UnifiedBeer;
    expect(payload.source).toBe('craft');
    expect(payload.id).toBe('craft-1');
  });

  it('loadBeerById with craft- ID throws error if not found', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const resultAction = await loadBeerById('craft-nonexistent')(dispatch, getState, undefined);
    
    expect(loadBeerById.rejected.match(resultAction)).toBe(true);
  });
});
