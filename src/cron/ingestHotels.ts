import cron from 'node-cron';
import { SUPPLIERS } from '../config/suppliers';
import { AcmeAdapter } from '../adapters/acmeAdapter';
import { PatagoniaAdapter } from '../adapters/patagoniaAdapter';
import { PaperfliesAdapter } from '../adapters/paperfliesAdapter';
import { mergeHotels } from '../services/hotelMergeService';
import logger from '../infrastructure/logger';
import { cache } from '../infrastructure/cache';

async function fetchAndCacheHotels() {
  try {
    const adapters = [
      { supplier: 'acme', adapter: new AcmeAdapter(SUPPLIERS.acme), enabled: SUPPLIERS.acme.enabled },
      { supplier: 'patagonia', adapter: new PatagoniaAdapter(SUPPLIERS.patagonia), enabled: SUPPLIERS.patagonia.enabled },
      { supplier: 'paperflies', adapter: new PaperfliesAdapter(SUPPLIERS.paperflies), enabled: SUPPLIERS.paperflies.enabled }
    ].filter((a) => a.enabled);

    const results = await Promise.all(
      adapters.map(async (a) => ({
        supplier: a.supplier,
        hotels: await a.adapter.fetchHotels()
      }))
    );

    const merged = mergeHotels(results);

    await cache.set('mergedHotels', merged);
    logger.info(`Hotel data cached. Total: ${merged.length}`);
  } catch (err) {
    logger.error(`Failed to fetch hotels: ${err}`);
  }
}

// Run every 10 minutes
cron.schedule('*/10 * * * *', fetchAndCacheHotels);

export default fetchAndCacheHotels;
