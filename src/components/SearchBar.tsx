import { Search, Sun, Moon } from "lucide-react";
import { IconButton } from "@/components/IconButton";
import { Input } from "@/components/ui/input";
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
    <header className="relative flex min-h-[74px] items-center justify-center px-16 py-4">
      {/* El buscador solo se muestra en Inicio y Notas */}
      {showSearch && (
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar notas..."
            className="h-9 bg-muted/60 pl-9 focus-visible:border-muted-foreground/40 focus-visible:ring-0"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
      )}

      <IconButton
        label={theme === "dark" ? "Tema claro" : "Tema oscuro"}
        size="icon"
        className="absolute right-6 top-1/2 -translate-y-1/2"
        onClick={onToggleTheme}
      >
        {theme === "dark" ? <Sun /> : <Moon />}
      </IconButton>
    </header>
  );
}

export default SearchBar;
