/**
 * M3 Search Coordinator — Route registration.
 * Registers all search endpoints under /api/v1/creators/ and /api/v1/search/.
 */
import { Hono } from 'hono';
import type { MeilisearchAdapter, LLMAdapter } from '@mushin/adapters';
import { createSearchRoutes } from './filtered-search.js';
import { createNLSearchRoutes } from './nl-search.js';
import { createQuoteRoutes } from './quote.js';

export function createM3Routes(
  meilisearch: MeilisearchAdapter,
  llm: LLMAdapter,
): Hono {
  const routes = new Hono();

  // Mount search endpoints
  routes.route('/creators', createSearchRoutes(meilisearch));
  routes.route('/creators', createNLSearchRoutes(meilisearch, llm));
  routes.route('/search', createQuoteRoutes());

  return routes;
}
