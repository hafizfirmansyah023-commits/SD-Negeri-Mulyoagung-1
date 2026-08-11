import { useState, useMemo } from 'react';

export interface UseCmsFilterOptions<T> {
  items: T[];
  searchFields?: (keyof T)[];
  initialFilters?: Record<string, string>;
  customFilter?: (item: T, searchTerm: string, filters: Record<string, string>) => boolean;
}

export function useCmsFilter<T>({
  items,
  searchFields = [],
  initialFilters = {},
  customFilter,
}: UseCmsFilterOptions<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);

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
        return customFilter(item, searchTerm, filters);
      }

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
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
  }, [items, searchTerm, filters, searchFields, customFilter]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    resetFilter,
    isFiltered,
    filteredItems,
  };
}
