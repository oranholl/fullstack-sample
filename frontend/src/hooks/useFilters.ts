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

export function useFilters() {
  const [searchParams] = useSearchParams();
  const searchFromUrl = searchParams.get("search") || "";

  const [filters, setFilters] = useState<PokemonFilters>({
    ...initialFilters,
    name: searchFromUrl,
  });

  useEffect(() => {
    setFilters(prev => ({ ...prev, name: searchFromUrl }));
  }, [searchFromUrl]);

  const updateFilter = (field: keyof PokemonFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

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