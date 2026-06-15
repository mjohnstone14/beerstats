import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface BeerState {
  value: number;
  data: Array<any>;
  status: string;
  error: unknown;
}

const initialState: BeerState = {
  value: 0,
  data: [],
  status: 'idle',
  error: null,
};

// --- Mock data generator (replaces dead random-data-api.com) ---
const beerNames = [
  'Hercules Double IPA', 'Shakespeare Oatmeal Stout', 'Yeti Imperial Stout',
  'Hop Stoopid', 'Arrogant Bastard Ale', 'Pliny The Elder', 'Two Hearted Ale',
  'Sierra Nevada Pale Ale', 'Founders Breakfast Stout', 'Stone IPA',
  'Lagunitas IPA', 'Dogfish Head 60 Minute', 'Fat Tire Amber Ale',
  'Brooklyn Lager', 'Anchor Steam Beer', 'Samuel Adams Boston Lager',
  'Blue Moon Belgian White', 'Goose Island 312', 'Deschutes Mirror Pond',
  'Dale\'s Pale Ale', 'Sculpin IPA', 'Torpedo Extra IPA', 'Ranger IPA',
  'Elysian Space Dust', 'Bell\'s Oberon', 'Sweetwater 420', 'Odell IPA',
  'New Belgium Voodoo Ranger', 'Firestone Walker 805', 'Ballast Point Grunion',
];
const beerStyles = [
  'IPA', 'Stout', 'Porter', 'Pale Ale', 'Lager', 'Pilsner', 'Belgian Dubbel',
  'Wheat Beer', 'Amber Ale', 'Brown Ale', 'Hefeweizen', 'Saison', 'Bock',
  'Kölsch', 'Märzen', 'Scottish Ale', 'ESB', 'Blonde Ale',
];
const beerHops = [
  'Cascade', 'Centennial', 'Chinook', 'Citra', 'Columbus', 'Fuggle',
  'Galaxy', 'Mosaic', 'Saaz', 'Simcoe', 'Amarillo', 'Hallertau',
  'Nugget', 'Willamette', 'Mt. Hood', 'Northern Brewer',
];
const beerMalts = [
  'Pale Ale Malt', 'Munich', 'Vienna', 'Crystal 60', 'Chocolate',
  'Black Patent', 'Caramel', 'Pilsner Malt', 'Wheat Malt', 'Roasted Barley',
  'Two-row', 'Biscuit Malt', 'Honey Malt', 'Smoked Malt',
];
const beerYeasts = [
  'Safale US-05', 'Wyeast 1056', 'White Labs WLP001', 'Safale S-04',
  'Wyeast 3068', 'White Labs WLP300', 'Safale T-58', 'Wyeast 1968',
  'Lallemand Nottingham', 'Fermentis SafLager W-34/70',
];
const beerBrands = [
  'Stone', 'Sierra Nevada', 'Founders', 'Lagunitas', 'Dogfish Head',
  'New Belgium', 'Deschutes', 'Bell\'s', 'Odell', 'Firestone Walker',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMockBeers(size: number) {
  return Array.from({ length: size }, (_, i) => ({
    id: i + 1,
    uid: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${i}`,
    brand: pick(beerBrands),
    name: pick(beerNames),
    style: pick(beerStyles),
    hop: pick(beerHops),
    yeast: pick(beerYeasts),
    malts: pick(beerMalts),
    ibu: `${Math.floor(Math.random() * 90) + 10} IBU`,
    alcohol: `${(Math.random() * 10 + 2).toFixed(1)}%`,
    blg: `${(Math.random() * 20 + 5).toFixed(1)}°Blg`,
  }));
}
// --- End mock data generator ---

const fetchBeerData = createAsyncThunk('data/fetchBeerData', async (size: number) => {
  // Simulate network latency for realistic UX
  await new Promise(resolve => setTimeout(resolve, 300));
  return generateMockBeers(size);
});

export const beerSlice = createSlice({
  name: 'beer',
  initialState,
  reducers: {
    getBeer: (state) => {
      state.value += 1;
    },
    getBeerByAmount: (state, action: PayloadAction<number>) => {
      console.log("Getting " + action.payload + " beers");
      state.value = state.value;
    },
    setBeerAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    clearBeerData: (state) => {
      state.value = 0;
      state.status = 'idle';
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // handle pending
    builder.addCase(fetchBeerData.pending, (state) => {
      state.status = 'loading';
    });

    // handle fulfilled
    builder.addCase(fetchBeerData.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload;
    });

    // handle rejected
    builder.addCase(fetchBeerData.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export { fetchBeerData };
export const { getBeer, setBeerAmount, getBeerByAmount, clearBeerData } = beerSlice.actions;

export default beerSlice.reducer;

