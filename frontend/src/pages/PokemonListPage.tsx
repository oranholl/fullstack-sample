import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PokemonCard from "../components/PokemonCard";
import { GET_POKEMONS, DELETE_POKEMON } from "../graphql/queries";
import { SORT_OPTIONS, PAGE_SIZE_OPTIONS } from "../constants/pokemon";
import { useAuth } from "../hooks/useAuth";
import { useFilters } from "../hooks/useFilters";
import { POKEMON_TYPES } from "../constants/pokemon";

export default function PokemonListPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("NAME");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [showFilters, setShowFilters] = useState(false);
  
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const { filters, updateFilter, clearFilters, getGraphQLFilters } = useFilters();

  const { data, loading, error, refetch } = useQuery(GET_POKEMONS, {
    variables: {
      page,
      pageSize,
      sortBy,
      sortOrder,
      filter: getGraphQLFilters(),
    },
  });

  const [deletePokemon] = useMutation(DELETE_POKEMON, {
    onCompleted: () => refetch(),
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) return;
    if (!confirm("Are you sure you want to delete this Pokémon?")) return;

    try {
      await deletePokemon({ variables: { token, id } });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    updateFilter(field as any, value);
    setPage(1);
  };

  const handleClearFilters = () => {
    clearFilters();
    setPage(1);
    window.history.pushState({}, "", "/");
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("_");
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const handleSurpriseMe = () => {
    if (data?.pokemons.totalCount) {
      const randomNum = Math.floor(Math.random() * data.pokemons.totalCount) + 1;
      navigate(`/pokemon/${randomNum}`);
    }
  };

  if (loading) return <div className="content-wrapper"><p>Loading...</p></div>;
  if (error) return <div className="content-wrapper"><p>Error: {error.message}</p></div>;

  const { items, totalCount, pageInfo } = data.pokemons;

  return (
    <>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`advanced-search-toggle ${showFilters ? "open" : ""}`}
      >
        Show Advanced Search
      </button>

      <div className="content-wrapper">
        {filters.name && (
          <div style={{
            backgroundColor: "#dbeafe",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span>
              Searching for: <strong>{filters.name}</strong>
            </span>
            <button
              onClick={handleClearFilters}
              style={{
                background: "none",
                border: "none",
                color: "#3b82f6",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Clear search
            </button>
          </div>
        )}

        {showFilters && (
          <div className="filters-panel">
            <h2 className="filters-title">Filters</h2>
            <div className="filters-grid">
              <div className="filter-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={filters.name}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  placeholder="Search by name"
                  className="filter-input"
                />
              </div>
              <div className="filter-group">
                <label className="form-label">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="filter-input"
                >
                  <option value="">All Types</option>
                  {POKEMON_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label className="form-label">Height Range (cm)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    value={filters.minHeight}
                    onChange={(e) => handleFilterChange("minHeight", e.target.value)}
                    placeholder="Min"
                    className="filter-input"
                  />
                  <input
                    type="number"
                    value={filters.maxHeight}
                    onChange={(e) => handleFilterChange("maxHeight", e.target.value)}
                    placeholder="Max"
                    className="filter-input"
                  />
                </div>
              </div>
              <div className="filter-group">
                <label className="form-label">Weight Range (kg)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    value={filters.minWeight}
                    onChange={(e) => handleFilterChange("minWeight", e.target.value)}
                    placeholder="Min"
                    className="filter-input"
                  />
                  <input
                    type="number"
                    value={filters.maxWeight}
                    onChange={(e) => handleFilterChange("maxWeight", e.target.value)}
                    placeholder="Max"
                    className="filter-input"
                  />
                </div>
              </div>
            </div>
            <button onClick={handleClearFilters} className="clear-filters-button">
              Clear Filters
            </button>
          </div>
        )}

        <div className="controls-bar">
          <button className="surprise-button" onClick={handleSurpriseMe}>
            Surprise Me!
          </button>

          <div className="sort-control">
            <span className="sort-label">Sort By</span>
            <select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            <p style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No Pokémon found</p>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="pokemon-grid">
            {items.map((pokemon: any) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                isAuthenticated={isAuthenticated}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <div className="pagination">
          <div className="page-size-selector">
            <span style={{ marginRight: "0.5rem", color: "#6b7280", fontSize: "0.9rem" }}>
              Items per page:
            </span>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                onClick={() => {
                  setPageSize(size);
                  setPage(1);
                }}
                className={`page-size-button ${pageSize === size ? "active" : ""}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {items.length > 0 && (
          <div className="pagination">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="page-nav-button"
            >
              ← Previous
            </button>
            <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              Page {pageInfo.currentPage} of {pageInfo.totalPages} ({totalCount} total)
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= pageInfo.totalPages}
              className="page-nav-button"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}