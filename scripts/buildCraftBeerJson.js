const https = require('https');
const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const BEERS_URL = 'https://raw.githubusercontent.com/nickhould/craft-beers-dataset/master/data/processed/beers.csv';
const BREWERIES_URL = 'https://raw.githubusercontent.com/nickhould/craft-beers-dataset/master/data/processed/breweries.csv';

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    let data = '';
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location).then(resolve).catch(reject);
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function buildData() {
  console.log('Downloading beers.csv...');
  const beersCsv = await downloadFile(BEERS_URL);
  console.log('Downloading breweries.csv...');
  const breweriesCsv = await downloadFile(BREWERIES_URL);

  console.log('Parsing CSVs...');
  const beers = Papa.parse(beersCsv, { header: true, skipEmptyLines: true }).data;
  const breweriesList = Papa.parse(breweriesCsv, { header: true, skipEmptyLines: true }).data;

  // Build brewery lookup by id
  // breweries fields: ,name,city,state
  // Wait, looking at the dataset, the first column is the index which has no header.
  // brewery id is typically the index column if there's no id, but the github csv has `Unnamed: 0` as the id.
  const breweries = {};
  for (const b of breweriesList) {
    const id = b[''] || b['Unnamed: 0']; // First column is usually empty string header in this dataset
    breweries[id] = b;
  }

  console.log('Merging...');
  const unifiedBeers = [];

  for (const b of beers) {
    const breweryId = b.brewery_id;
    const brewery = breweries[breweryId] || {};

    const unified = {
      id: `craft-${b.id || b['']}`,
      source: 'craft',
      name: b.name || 'Unknown Beer',
      brewery: brewery.name || 'Unknown Brewery',
      location: (brewery.city && brewery.state) ? `${brewery.city}, ${brewery.state.trim()}` : 'USA',
      style: b.style || 'Other',
      abv: b.abv ? parseFloat(b.abv) * 100 : null, // ABV is like 0.05 in CSV -> 5.0
      ibu: b.ibu ? parseFloat(b.ibu) : null,
      description: '', // No desc in this dataset
      image: null,
    };
    
    // Formatting ABV slightly to avoid long decimals
    if (unified.abv !== null) {
      unified.abv = Math.round(unified.abv * 10) / 10;
    }

    unifiedBeers.push(unified);
  }

  const outPath = path.join(__dirname, '..', 'src', 'data', 'craftBeers.json');
  fs.writeFileSync(outPath, JSON.stringify(unifiedBeers, null, 2));
  console.log(`Successfully wrote ${unifiedBeers.length} beers to ${outPath}`);
}

buildData().catch(console.error);
