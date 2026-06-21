export interface Column {
    id: 'name' | 'style' | 'ibu' | 'alcohol' | 'malts' | 'hop' | 'yeast';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

// ── Punk API types ──────────────────────────────────────────────

export interface PunkIngredient {
  name: string;
  amount: {
    value: number;
    unit: string;
  };
  add?: string;
  attribute?: string;
}

export interface UnifiedBeer {
  id: string | number;        // e.g. 192 or "craft-10"
  source: 'punk' | 'craft';
  name: string;
  brewery: string;            // 'BrewDog' or specific US brewery
  location?: string;
  tagline?: string;
  style: string;
  abv: number | null;
  ibu: number | null;
  ebc?: number | null;
  srm?: number | null;
  ph?: number | null;
  description: string;
  image: string | null;
  food_pairing?: string[];
  brewers_tips?: string;
  first_brewed?: string;
  ingredients?: {
    malt: PunkIngredient[];
    hops: PunkIngredient[];
    yeast: string;
  };
  // Enrichment fields from Open Brewery DB (optional, non-breaking)
  website_url?: string | null;
  brewery_type?: string | null;
}

export interface PunkBeer {
  id: number;
  name: string;
  tagline: string;
  first_brewed: string;
  description: string;
  image_url: string | null;
  abv: number;
  ibu: number | null;
  ebc: number | null;
  srm: number | null;
  ph: number | null;
  attenuation_level?: number;
  volume?: { value: number; unit: string };
  boil_volume?: { value: number; unit: string };
  method?: {
    mash_temp: { temp: { value: number; unit: string }; duration: number | null }[];
    fermentation: { temp: { value: number; unit: string } };
    twist: string | null;
  };
  ingredients: {
    malt: PunkIngredient[];
    hops: PunkIngredient[];
    yeast: string;
  };
  food_pairing: string[];
  brewers_tips: string;
  contributed_by?: string;
}

export interface Data {
    name: string;
    style: string;
    ibu: string;
    alcohol: string;
    malts: string;
    hop: string;
    yeast: string;
}

export interface BeerObject {
    alcohol: string;
    blg: string;
    brand: string;
    hop: string;
    ibu: string;
    id: number;
    malts: string;
    name: string;
    style: string;
    uid: string;
    yeast: string;
}

/** Raw Open Brewery DB response shape — used internally by the API only */
export interface ObdbBrewery {
  id: string;
  name: string;
  brewery_type: string;
  address_1: string | null;
  city: string;
  state_province: string;
  country: string;
  longitude: number | null;
  latitude: number | null;
  phone: string | null;
  website_url: string | null;
}
