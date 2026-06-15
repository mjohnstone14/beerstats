import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { PunkBeer } from '../interfaces/base';
import { BeerObject } from '../interfaces/base';

const PUNK_API_BASE = 'https://punkapi-alxiw.amvera.io/v3';

// ── Helpers ──────────────────────────────────────────────────────

/**
 * Maps a PunkBeer from the API to the BeerObject shape used by the
 * existing BeerTable, ABVChart and IBUDoughnut components.
 */
export function punkBeerToBeerObject(beer: PunkBeer): BeerObject {
  const primaryMalt = beer.ingredients?.malt?.[0]?.name ?? '—';
  const primaryHop = beer.ingredients?.hops?.[0]?.name ?? '—';
  const yeast = beer.ingredients?.yeast ?? '—';

  return {
    id: beer.id,
    uid: String(beer.id),
    brand: 'BrewDog',
    name: beer.name,
    style: beer.tagline,
    hop: primaryHop,
    yeast: yeast,
    malts: primaryMalt,
    ibu: beer.ibu != null ? `${beer.ibu} IBU` : '0 IBU',
    alcohol: beer.abv != null ? `${beer.abv}%` : '0%',
    blg: beer.ebc != null ? `${beer.ebc}°EBC` : '—',
  };
}

// ── Thunks ───────────────────────────────────────────────────────

/**
 * Search beers by name using the Punk API.
 * Falls back to empty array on error so the UI can show a friendly message.
 */
export const searchPunkBeers = createAsyncThunk(
  'myBeers/searchPunkBeers',
  async (query: string) => {
    const params: Record<string, string | number> = { page: 1, per_page: 80 };
    if (query.trim()) {
      // v3 API uses spaces directly in beer_name, not underscores
      params.beer_name = query.trim();
    }
    const response = await axios.get<PunkBeer[]>(`${PUNK_API_BASE}/beers`, { params });
    return response.data;
  }
);

/**
 * Load a single beer by ID (used by the BeerDetail page).
 */
export const loadBeerById = createAsyncThunk(
  'myBeers/loadBeerById',
  async (id: number) => {
    const response = await axios.get<PunkBeer[]>(`${PUNK_API_BASE}/beers/${id}`);
    return response.data[0];
  }
);

// ── Slice ────────────────────────────────────────────────────────

interface MyBeersState {
  searchResults: PunkBeer[];
  myList: PunkBeer[];
  selectedBeerId: number | null;
  searchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MyBeersState = {
  searchResults: [],
  myList: [],
  selectedBeerId: null,
  searchStatus: 'idle',
  detailStatus: 'idle',
  error: null,
};

export const myBeersSlice = createSlice({
  name: 'myBeers',
  initialState,
  reducers: {
    /**
     * Add a beer to the user's personal list.
     * Prevents duplicates by checking the id.
     */
    addToMyList: (state, action: PayloadAction<PunkBeer>) => {
      const alreadyAdded = state.myList.some((b) => b.id === action.payload.id);
      if (!alreadyAdded) {
        state.myList.push(action.payload);
      }
    },
    /** Remove a beer from the personal list by id. */
    removeFromMyList: (state, action: PayloadAction<number>) => {
      state.myList = state.myList.filter((b) => b.id !== action.payload);
    },
    /** Clear the entire personal list. */
    clearMyList: (state) => {
      state.myList = [];
    },
    /** Mark a beer as the focused/selected one for the detail page. */
    setSelectedBeerId: (state, action: PayloadAction<number | null>) => {
      state.selectedBeerId = action.payload;
    },
    /** Reset search state back to idle. */
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // searchPunkBeers
    builder.addCase(searchPunkBeers.pending, (state) => {
      state.searchStatus = 'loading';
      state.error = null;
    });
    builder.addCase(searchPunkBeers.fulfilled, (state, action) => {
      state.searchStatus = 'succeeded';
      state.searchResults = action.payload;
    });
    builder.addCase(searchPunkBeers.rejected, (state, action) => {
      state.searchStatus = 'failed';
      state.error = action.error.message ?? 'Failed to fetch beers';
    });

    // loadBeerById
    builder.addCase(loadBeerById.pending, (state) => {
      state.detailStatus = 'loading';
    });
    builder.addCase(loadBeerById.fulfilled, (state) => {
      state.detailStatus = 'succeeded';
    });
    builder.addCase(loadBeerById.rejected, (state, action) => {
      state.detailStatus = 'failed';
      state.error = action.error.message ?? 'Failed to load beer';
    });
  },
});

export const {
  addToMyList,
  removeFromMyList,
  clearMyList,
  setSelectedBeerId,
  clearSearch,
} = myBeersSlice.actions;

export default myBeersSlice.reducer;
