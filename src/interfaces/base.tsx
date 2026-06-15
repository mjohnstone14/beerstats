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
  id: string | number; // e.g. 192 or "craft-10"
  source: 'punk' | 'craft';
  name: string;
  brewery: string; // 'BrewDog' or specific US brewery
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
}

export interface PunkBeer {
  id: number;
  name: string;
  tagline: string;
  first_brewed: string;
  description: string;
  image: string | null;
  abv: number;
  ibu: number | null;
  ebc: number | null;
  srm: number | null;
  ph: number | null;
  ingredients: {
    malt: PunkIngredient[];
    hops: PunkIngredient[];
    yeast: string;
  };
  food_pairing: string[];
  brewers_tips: string;
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
  