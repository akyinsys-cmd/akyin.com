import { useMemo, useState } from 'react';
import { ServiceSearchItem } from '../utils/serviceSearchIndex';

export interface UseSearchOptions {
  limit?: number;
  initialQuery?: string;
}

export interface UseSearchResult {
  query: string;
  setQuery: (q: string) => void;
  clearQuery: () => void;
  hasQuery: boolean;
  results: ServiceSearchItem[];
  resultCount: number;
  matchingSlugs: Set<string>;
  matchingIds: Set<string>;
  isMatchingSlug: (slug: string) => boolean;
  isMatchingItem: (item: { slug?: string; name?: string; category?: string; description?: string }) => boolean;
}

/**
 * Custom React hook to perform performant case-insensitive filtering on a ServiceSearchItem index.
 * Ranks title/name matches first, followed by category and description hits.
 */
export function useSearch(
  index: ServiceSearchItem[],
  options?: UseSearchOptions
): UseSearchResult {
  const [query, setQuery] = useState(options?.initialQuery || '');

  const { results, matchingSlugs, matchingIds } = useMemo(() => {
    const raw = query.trim().toLowerCase();
    if (!raw) {
      return {
        results: [],
        matchingSlugs: new Set<string>(),
        matchingIds: new Set<string>(),
      };
    }

    const limit = options?.limit ?? 12;

    const scored: Array<{ item: ServiceSearchItem; score: number }> = [];

    for (const item of index) {
      const name = item.name.toLowerCase();
      const cat = item.category.toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const slug = (item.slug || '').toLowerCase();
      const keywords = (item.keywords || []).map((k) => k.toLowerCase());

      let score = 0;

      if (name === raw) {
        score = 100;
      } else if (name.startsWith(raw)) {
        score = 80;
      } else if (name.includes(raw)) {
        score = 60;
      } else if (keywords.some((k) => k.includes(raw))) {
        score = 50;
      } else if (cat.includes(raw)) {
        score = 40;
      } else if (slug.includes(raw)) {
        score = 30;
      } else if (desc.includes(raw)) {
        score = 20;
      }

      if (score > 0) {
        scored.push({ item, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);

    const topResults = scored.slice(0, limit).map((s) => s.item);
    const slugsSet = new Set(scored.map((s) => s.item.slug.toLowerCase()));
    const idsSet = new Set(scored.map((s) => s.item.id));

    return {
      results: topResults,
      matchingSlugs: slugsSet,
      matchingIds: idsSet,
    };
  }, [index, query, options?.limit]);

  const clearQuery = () => setQuery('');

  const isMatchingSlug = (slug: string) => {
    if (!query.trim()) return false;
    return matchingSlugs.has((slug || '').toLowerCase());
  };

  const isMatchingItem = (item: {
    slug?: string;
    name?: string;
    category?: string;
    description?: string;
  }) => {
    const raw = query.trim().toLowerCase();
    if (!raw) return false;
    if (item.slug && matchingSlugs.has(item.slug.toLowerCase())) return true;
    if (item.name && item.name.toLowerCase().includes(raw)) return true;
    if (item.category && item.category.toLowerCase().includes(raw)) return true;
    if (item.description && item.description.toLowerCase().includes(raw)) return true;
    return false;
  };

  return {
    query,
    setQuery,
    clearQuery,
    hasQuery: query.trim().length > 0,
    results,
    resultCount: results.length,
    matchingSlugs,
    matchingIds,
    isMatchingSlug,
    isMatchingItem,
  };
}
