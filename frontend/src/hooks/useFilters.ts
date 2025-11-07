import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export interface PokemonFilters {
  name: string;
  minHeight: string;
  maxHeight: string;
  minWeight: string;
  maxWeight: string;
  type: string;
}

const initialFilters: PokemonFilters = {
  name: "",
  minHeight: "",
  maxHeight: "",
  minWeight: "",
  maxWeight: "",
  type: "",
};

/**
 * Hook to manage Pokemon filter state with URL sync
 */
export function useFilters() {
  const [searchParams] = useSearchParams();
  const searchFromUrl = searchParams.get("search") || "";

  const [filters, setFilters] = useState<PokemonFilters>({
    ...initialFilters,
    name: searchFromUrl,
  });

  // Update filter when URL search param changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, name: searchFromUrl }));
  }, [searchFromUrl]);

  const updateFilter = (field: keyof PokemonFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  // Convert filters to GraphQL format (removing empty values)
  const getGraphQLFilters = () => ({
    name: filters.name || undefined,
    minHeight: filters.minHeight ? parseInt(filters.minHeight) : undefined,
    maxHeight: filters.maxHeight ? parseInt(filters.maxHeight) : undefined,
    minWeight: filters.minWeight ? parseInt(filters.minWeight) : undefined,
    maxWeight: filters.maxWeight ? parseInt(filters.maxWeight) : undefined,
    type: filters.type || undefined,
  });

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return {
    filters,
    updateFilter,
    clearFilters,
    getGraphQLFilters,
    hasActiveFilters,
  };
}
