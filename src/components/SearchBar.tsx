
import { useState, useEffect } from "react";
import { Search, Sun, Moon } from "lucide-react";

function SearchBar() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="searchbar">

      <div className="searchbar__search">
        <Search size={20} />

        <input
          type="text"
          placeholder="Buscar notas..."
          className="searchbar__input"
        />
      </div>

      <button
        className="searchbar__theme"
        onClick={toggleTheme}
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
