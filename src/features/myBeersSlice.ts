import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { PunkBeer, UnifiedBeer } from '../interfaces/base';
import { BeerObject } from '../interfaces/base';
import craftBeersData from '../data/craftBeers.json';

const PUNK_API_BASE = 'https://punkapi-alxiw.amvera.io/v3';

// ── Helpers ──────────────────────────────────────────────────────

const STYLE_KEYWORDS = [
  { keyword: 'ipa', style: 'IPA' },
  { keyword: 'india pale ale', style: 'IPA' },
  { keyword: 'stout', style: 'Stout' },
  { keyword: 'porter', style: 'Porter' },
  { keyword: 'lager', style: 'Lager' },
  { keyword: 'pilsner', style: 'Pilsner' },
  { keyword: 'pils', style: 'Pilsner' },
  { keyword: 'pale ale', style: 'Pale Ale' },
  { keyword: 'wheat', style: 'Wheat' },
  { keyword: 'hefeweizen', style: 'Wheat' },
  { keyword: 'saison', style: 'Saison' },
  { keyword: 'sour', style: 'Sour' },
  { keyword: 'amber', style: 'Amber' },
  { keyword: 'blonde', style: 'Blonde' },
  { keyword: 'brown', style: 'Brown Ale' },
  { keyword: 'barley wine', style: 'Barleywine' },
  { keyword: 'barleywine', style: 'Barleywine' },
  { keyword: 'belgian', style: 'Belgian' },
  { keyword: 'ale', style: 'Ale' }
];

export function getBeerStyle(beer: UnifiedBeer | PunkBeer): string {
  const text = `${beer.name} ${beer.tagline || ''}`.toLowerCase();
  for (const { keyword, style } of STYLE_KEYWORDS) {
    if (text.includes(keyword)) {
      return style;
    }
  }
  return 'Other';
}

/**
 * Maps a PunkBeer to UnifiedBeer format.
 */
export function punkToUnified(beer: PunkBeer): UnifiedBeer {
  return {
    id: beer.id,
    source: 'punk',
    name: beer.name,
    brewery: 'BrewDog',
    location: 'Scotland, UK',
    tagline: beer.tagline,
    style: getBeerStyle(beer),
    abv: beer.abv,
    ibu: beer.ibu,
    ebc: beer.ebc,
    srm: beer.srm,
    ph: beer.ph,
    description: beer.description,
    image: beer.image_url,
    food_pairing: beer.food_pairing,
    brewers_tips: beer.brewers_tips,
    first_brewed: beer.first_brewed,
    ingredients: beer.ingredients,
  };
}

/**
 * Maps a UnifiedBeer to the BeerObject shape used by the
 * existing BeerTable, ABVChart and IBUDoughnut components.
 */
export function beerToBeerObject(beer: UnifiedBeer): BeerObject {
  const primaryMalt = beer.ingredients?.malt?.[0]?.name ?? '—';
  const primaryHop = beer.ingredients?.hops?.[0]?.name ?? '—';
  const yeast = beer.ingredients?.yeast ?? '—';

  return {
    id: typeof beer.id === 'number' ? beer.id : parseInt(String(beer.id).replace(/\D/g, ''), 10) || 0,
    uid: String(beer.id),
    brand: beer.brewery,
    name: beer.name,
    style: beer.style,
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
 * Search beers by name combining the Punk API and local Craft Beers data.
 */
export const searchAllBeers = createAsyncThunk(
  'myBeers/searchAllBeers',
  async (query: string) => {
    const q = query.trim().toLowerCase();

    // 1. Fetch from Punk API
    const params: Record<string, string | number> = { page: 1, per_page: 80 };
    if (q) params.beer_name = q;
    
    let punkBeers: UnifiedBeer[] = [];
    try {
      const response = await axios.get<PunkBeer[]>(`${PUNK_API_BASE}/beers`, { params });
      punkBeers = response.data.map(punkToUnified);
    } catch (e) {
      console.warn('Punk API failed, falling back to local only', e);
    }

    // 2. Fetch from Local Craft Beers
    let craftBeers = craftBeersData as UnifiedBeer[];
    if (q) {
      craftBeers = craftBeers.filter(
        b => b.name.toLowerCase().includes(q) || b.style.toLowerCase().includes(q) || b.brewery.toLowerCase().includes(q)
      );
    }

    // Combine them
    return [...punkBeers, ...craftBeers];
  }
);

/**
 * Load a single beer by ID (used by the BeerDetail page).
 * Checks local first, then hits Punk API if it's a numeric ID.
 */
export const loadBeerById = createAsyncThunk(
  'myBeers/loadBeerById',
  async (id: string | number) => {
    if (String(id).startsWith('craft-')) {
      const craft = (craftBeersData as UnifiedBeer[]).find(b => String(b.id) === String(id));
      if (!craft) throw new Error('Craft beer not found');
      return craft;
    } else {
      const response = await axios.get<PunkBeer[]>(`${PUNK_API_BASE}/beers/${id}`);
      return punkToUnified(response.data[0]);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────

interface MyBeersState {
  searchResults: UnifiedBeer[];
  myList: UnifiedBeer[];
  selectedBeerId: string | number | null;
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
    addToMyList: (state, action: PayloadAction<UnifiedBeer>) => {
      const alreadyAdded = state.myList.some((b) => String(b.id) === String(action.payload.id));
      if (!alreadyAdded) {
        state.myList.push(action.payload);
      }
    },
    /** Remove a beer from the personal list by id. */
    removeFromMyList: (state, action: PayloadAction<string | number>) => {
      state.myList = state.myList.filter((b) => String(b.id) !== String(action.payload));
    },
    /** Clear the entire personal list. */
    clearMyList: (state) => {
      state.myList = [];
    },
    /** Mark a beer as the focused/selected one for the detail page. */
    setSelectedBeerId: (state, action: PayloadAction<string | number | null>) => {
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
    // searchAllBeers
    builder.addCase(searchAllBeers.pending, (state) => {
      state.searchStatus = 'loading';
      state.error = null;
    });
    builder.addCase(searchAllBeers.fulfilled, (state, action) => {
      state.searchStatus = 'succeeded';
      state.searchResults = action.payload;
    });
    builder.addCase(searchAllBeers.rejected, (state, action) => {
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
