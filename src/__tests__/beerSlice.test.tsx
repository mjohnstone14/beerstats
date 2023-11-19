import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { configureStore, EnhancedStore, PayloadAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import beerReducer, { fetchBeerData, getBeer, getBeerByAmount, setBeerAmount, clearBeerData } from '../features/beerSlice';

const mockAxios = new MockAdapter(axios);

describe('beerSlice', () => {
  let store: EnhancedStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        beer: beerReducer,
      },
    });
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should handle getBeer', () => {
    store.dispatch(getBeer());
    const state = store.getState().beer;
    expect(state.value).toEqual(1);
  });

  it('should handle getBeerByAmount', () => {
    store.dispatch(getBeerByAmount(5));
    const state = store.getState().beer;
    expect(state.value).toEqual(0);
  });

  it('should handle setBeerAmount', () => {
    store.dispatch(setBeerAmount(3));
    const state = store.getState().beer;
    expect(state.value).toEqual(3);
  });

  it('should handle clearBeerData', async () => {
    // Set initial state with some data
    store.dispatch(setBeerAmount(3));
    await (store.dispatch as ThunkDispatch<RootState, undefined, PayloadAction<any>>)(fetchBeerData(5))

    // Clear the data
    store.dispatch(clearBeerData());
    const state = store.getState().beer;
    expect(state.value).toEqual(0);
    expect(state.status).toEqual('idle');
    expect(state.data).toEqual([]);
    expect(state.error).toBeNull();
  });

  it('should update state on successful fetchBeerData', async () => {
    mockAxios.onGet('https://random-data-api.com/api/v2/beers?size=5').reply(200, [{ beer: 'Beer 1' }]);

    await (store.dispatch as ThunkDispatch<RootState, undefined, PayloadAction<any>>)(fetchBeerData(5))


    const state = store.getState().beer;
    expect(state.status).toEqual('succeeded');
    expect(state.data).toEqual([{ beer: 'Beer 1' }]);
  });

  it('should handle fetchBeerData failure', async () => {
    mockAxios.onGet('https://random-data-api.com/api/v2/beers?size=5').reply(500, { error: 'Server error' });

    await (store.dispatch as ThunkDispatch<RootState, undefined, PayloadAction<any>>)(fetchBeerData(5))

    const state = store.getState().beer;
    expect(state.status).toEqual('failed');
    expect(state.error).toEqual('Request failed with status code 500');
  });
});
