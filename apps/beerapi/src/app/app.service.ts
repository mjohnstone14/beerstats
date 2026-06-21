import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { UnifiedBeer, PunkBeer, ObdbBrewery } from '@beerstats/shared-types';

const PUNK_API_BASE = 'https://punkapi-alxiw.amvera.io/v3';
const OBDB_API_BASE = 'https://api.openbrewerydb.org/v1';

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

@Injectable()
export class AppService implements OnModuleInit {
  private craftBeers: UnifiedBeer[] = [];

  onModuleInit() {
    this.loadCraftBeers();
  }

  private loadCraftBeers() {
    try {
      // Find craftBeers.json by looking in multiple possible locations
      let jsonPath = path.join(__dirname, 'assets/craftBeers.json');
      if (!fs.existsSync(jsonPath)) {
        jsonPath = path.join(__dirname, '../assets/craftBeers.json');
      }
      if (!fs.existsSync(jsonPath)) {
        jsonPath = path.resolve(process.cwd(), 'apps/beerapi/src/assets/craftBeers.json');
      }

      if (fs.existsSync(jsonPath)) {
        const rawData = fs.readFileSync(jsonPath, 'utf8');
        this.craftBeers = JSON.parse(rawData) as UnifiedBeer[];
        Logger.log(`Successfully loaded ${this.craftBeers.length} craft beers from ${jsonPath}`);
      } else {
        Logger.error(`Could not locate craftBeers.json at any resolved paths.`);
      }
    } catch (error) {
      Logger.error('Failed to read or parse craftBeers.json', error);
    }
  }

  private getBeerStyle(beerName: string, tagline?: string): string {
    const text = `${beerName} ${tagline || ''}`.toLowerCase();
    for (const { keyword, style } of STYLE_KEYWORDS) {
      if (text.includes(keyword)) {
        return style;
      }
    }
    return 'Other';
  }

  private punkToUnified(beer: PunkBeer): UnifiedBeer {
    return {
      id: beer.id,
      source: 'punk',
      name: beer.name,
      brewery: 'BrewDog',
      location: 'Scotland, UK',
      tagline: beer.tagline,
      style: this.getBeerStyle(beer.name, beer.tagline),
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

  private breweryToUnified(brewery: ObdbBrewery): UnifiedBeer {
    return {
      id: `obdb-${brewery.id}`,
      source: 'craft',
      name: brewery.name,
      brewery: brewery.name,
      location: `${brewery.city}, ${brewery.state_province || brewery.country}`,
      tagline: `Brewery Type: ${brewery.brewery_type}`,
      style: `${brewery.brewery_type.toUpperCase()} Brewery`,
      abv: null,
      ibu: null,
      description: `A ${brewery.brewery_type} brewery located in ${brewery.city}, ${brewery.state_province || brewery.country}. Details provided by Open Brewery DB.`,
      image: null,
      website_url: brewery.website_url,
      brewery_type: brewery.brewery_type,
    };
  }

  async searchBeers(query: string): Promise<UnifiedBeer[]> {
    const q = query.trim().toLowerCase();

    // 1. Search local craft beers
    let matchedCraft: UnifiedBeer[] = [];
    if (this.craftBeers.length > 0) {
      if (q) {
        matchedCraft = this.craftBeers.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.style.toLowerCase().includes(q) ||
            b.brewery.toLowerCase().includes(q)
        );
      } else {
        matchedCraft = [...this.craftBeers];
      }
    }

    // 2. Search Punk API beers
    let matchedPunk: UnifiedBeer[] = [];
    try {
      const params: Record<string, string | number> = { page: 1, per_page: 80 };
      if (q) {
        params.beer_name = q.replace(/\s+/g, '_');
      }
      const response = await axios.get<PunkBeer[]>(`${PUNK_API_BASE}/beers`, { params });
      matchedPunk = response.data.map((beer) => this.punkToUnified(beer));
    } catch (error) {
      Logger.warn(`Punk API failed or was throttled during search: ${error.message}`);
    }

    // 3. Search Open Brewery DB breweries
    let matchedBreweries: UnifiedBeer[] = [];
    if (q) {
      try {
        const response = await axios.get<ObdbBrewery[]>(
          `${OBDB_API_BASE}/breweries`,
          { params: { by_name: q, per_page: 15 } }
        );
        matchedBreweries = response.data.map((brewery) => this.breweryToUnified(brewery));
      } catch (error) {
        Logger.warn(`Open Brewery DB API failed during search: ${error.message}`);
      }
    }

    // Combine all matching streams
    return [...matchedPunk, ...matchedCraft, ...matchedBreweries];
  }

  async getBeerById(id: string | number): Promise<UnifiedBeer> {
    const idStr = String(id);

    // 1. Open Brewery DB Brewery
    if (idStr.startsWith('obdb-')) {
      const rawId = idStr.replace('obdb-', '');
      try {
        const response = await axios.get<ObdbBrewery>(`${OBDB_API_BASE}/breweries/${rawId}`);
        return this.breweryToUnified(response.data);
      } catch (error) {
        Logger.error(`Failed to fetch brewery from Open Brewery DB: ${rawId}`, error);
        throw new Error("We couldn't find the details for this brewery.");
      }
    }

    // 2. Local Craft Beer
    if (idStr.startsWith('craft-')) {
      const craftBeer = this.craftBeers.find((b) => String(b.id) === idStr);
      if (!craftBeer) {
        throw new Error("We couldn't find the details for this beer.");
      }
      return this.enrichWithBreweryMetadata(craftBeer);
    }

    // 3. Punk API Beer (numeric ID)
    try {
      const response = await axios.get<PunkBeer[] | PunkBeer>(`${PUNK_API_BASE}/beers/${id}`);
      const beerData = Array.isArray(response.data) ? response.data[0] : response.data;
      if (!beerData) {
        throw new Error("We couldn't find the details for this beer.");
      }
      const unifiedBeer = this.punkToUnified(beerData);
      return this.enrichWithBreweryMetadata(unifiedBeer);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("We couldn't find the details for this beer.");
      }
      throw new Error(error.message || "Oops, something went wrong while fetching the beer details.");
    }
  }

  private async enrichWithBreweryMetadata(beer: UnifiedBeer): Promise<UnifiedBeer> {
    try {
      const breweryName = beer.brewery;
      if (!breweryName || breweryName === 'BrewDog') return beer; // Skip BrewDog or empty names

      const response = await axios.get<ObdbBrewery[]>(
        `${OBDB_API_BASE}/breweries`,
        { params: { by_name: breweryName, per_page: 1 } }
      );

      if (response.data && response.data.length > 0) {
        const match = response.data[0];
        return {
          ...beer,
          website_url: match.website_url,
          brewery_type: match.brewery_type,
          // Enrich location if we didn't have it
          location: beer.location || `${match.city}, ${match.state_province || match.country}`,
        };
      }
    } catch (error) {
      Logger.warn(`Failed to enrich brewery metadata for ${beer.brewery}: ${error.message}`);
    }
    return beer;
  }
}
