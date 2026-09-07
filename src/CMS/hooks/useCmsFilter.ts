import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';

export interface UseCmsFilterOptions<T> {
  items: T[];
  searchFields?: (keyof T)[];
  initialFilters?: Record<string, string>;
  customFilter?: (item: T, searchTerm: string, filters: Record<string, string>) => boolean;
  debounceDelay?: number;
}

export function useCmsFilter<T>({
  items,
  searchFields = [],
  initialFilters = {},
  customFilter,
  debounceDelay = 1000,
}: UseCmsFilterOptions<T>) {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);

  // Auto-apply search from router state or custom search event (from CMS Global Search)
  useEffect(() => {
    const state = location.state as { cmsSearch?: string; search?: string } | null;
    const query = state?.cmsSearch || state?.search;
    if (query && typeof query === 'string') {
      setSearchTerm(query);
    }

    const handleCmsSearchEvent = (e: Event) => {
      const customEv = e as CustomEvent<{ search?: string }>;
      if (customEv.detail?.search) {
        setSearchTerm(customEv.detail.search);
      }
    };

    window.addEventListener('cms-search-filter', handleCmsSearchEvent);
    return () => {
      window.removeEventListener('cms-search-filter', handleCmsSearchEvent);
    };
  }, [location.state]);

  const setFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilter = () => {
    setSearchTerm('');
    setFilters(initialFilters);
  };

  const isFiltered = useMemo(() => {
    if (searchTerm.trim() !== '') return true;
    return Object.entries(filters).some(([key, val]) => {
      const defaultVal = initialFilters[key] || 'ALL';
      return val !== defaultVal;
    });
  }, [searchTerm, filters, initialFilters]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (customFilter) {
        return customFilter(item, debouncedSearchTerm, filters);
      }

      if (debouncedSearchTerm.trim()) {
        const query = debouncedSearchTerm.toLowerCase();
        const matchesSearch = searchFields.some((field) => {
          const val = item[field];
          return val ? String(val).toLowerCase().includes(query) : false;
        });
        if (!matchesSearch) return false;
      }

      // Default filter key-value matching
      for (const [key, value] of Object.entries(filters)) {
        if (value !== 'ALL') {
          const itemVal = (item as Record<string, unknown>)[key];
          if (String(itemVal) !== value) return false;
        }
      }

      return true;
    });
  }, [items, debouncedSearchTerm, filters, searchFields, customFilter]);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
    filters,
    setFilter,
    resetFilter,
    isFiltered,
    filteredItems,
  };
}
