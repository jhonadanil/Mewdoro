import { useEffect, useRef } from "react";
import { MagnifyingGlassIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { IconButton } from "@/components/IconButton";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ShortcutsHelp } from "./ShortcutsHelp";
import { IS_MAC } from "../utils/platform";
import type { Theme } from "../types";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  showSearch: boolean;
  theme: Theme;
  onToggleTheme: () => void;
}

function SearchBar({ query, onQueryChange, showSearch, theme, onToggleTheme }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl + K (Cmd + K en Mac) lleva al buscador desde cualquier sitio de Inicio o Notas
  useEffect(() => {
    if (!showSearch) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSearch]);

  return (
    <header className="relative flex min-h-[74px] items-center justify-center py-4 pl-14 pr-24 max-md:min-h-14 max-md:py-2 max-md:pl-4 max-md:pr-14 sm:px-24">
      {/* El buscador solo se muestra en Inicio y Notas */}
      {showSearch && (
        <div className="group relative w-full max-w-md">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Buscar notas…"
            aria-label="Buscar notas"
            aria-keyshortcuts={IS_MAC ? "Meta+K" : "Control+K"}
            // Al enfocar, solo se marca un poco el borde (sin el anillo de color de marca)
            className="h-10 bg-muted pl-10 pr-16 focus-visible:border-foreground/25 focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            // Enter deja de escribir (quita el foco) y conserva los resultados; Esc vacía la búsqueda y vuelve a Inicio
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                event.currentTarget.blur();
              } else if (event.key === "Escape" && query) {
                event.preventDefault();
                onQueryChange("");
              }
            }}
          />
          {/* El atajo solo se enseña al pasar el ratón por el buscador */}
          {!query && (
            <KbdGroup
              aria-hidden="true"
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Kbd>{IS_MAC ? "⌘" : "Ctrl"}</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          )}
        </div>
      )}

      {/* Atajos y tema, arriba a la derecha */}
      <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-0.5 sm:right-6">
        <span className="max-md:hidden">
          <ShortcutsHelp />
        </span>
        <IconButton label={theme === "dark" ? "Tema claro" : "Tema oscuro"} size="icon" onClick={onToggleTheme}>
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </IconButton>
      </div>
    </header>
  );
}

export default SearchBar;
