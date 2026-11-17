
import { Search, Sun, Moon } from "lucide-react";
import type { Theme } from "../types";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  showSearch: boolean;
  theme: Theme;
  onToggleTheme: () => void;
}

function SearchBar({ query, onQueryChange, showSearch, theme, onToggleTheme }: SearchBarProps) {
  return (
    <header className="searchbar">

      {/* El buscador solo se muestra en Inicio y Notas */}
      {showSearch && (
        <div className="searchbar__search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Buscar notas..."
            className="searchbar__input"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
      )}

      <button
        className="searchbar__theme"
        onClick={onToggleTheme}
        aria-label="Cambiar tema"
      >
        {theme === "dark" ? (
          <Sun size={20} />
        ) : (
          <Moon size={20} />
        )}
      </button>

    </header>
  );
}

export default SearchBar;
