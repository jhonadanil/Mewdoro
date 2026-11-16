
import { useState } from "react";

import {
  House,
  NotebookPen,
  Timer,
  Settings,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`sidebar-container ${isOpen ? "sidebar-container--open" : "sidebar-container--closed"}`}>

      <button
        className="sidebar__toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <PanelLeftClose size={20} />
        ) : (
          <PanelLeftOpen size={20} />
        )}
      </button>

      {isOpen && (
        <aside className="sidebar">

          {/* Navegación principal */}
          <div className="sidebar__menu">

            <a href="#inicio" className="sidebar__link sidebar__link--active">
              <House size={20} />
              <span>Inicio</span>
            </a>

            <a href="#notas" className="sidebar__link">
              <NotebookPen size={20} />
              <span>Notas</span>
            </a>

            <a href="#pomodoro" className="sidebar__link">
              <Timer size={20} />
              <span>Pomodoro</span>
            </a>

          </div>

          {/* Ajustes abajo */}
          <div className="sidebar__bottom">
            <a href="#ajustes" className="sidebar__link">
              <Settings size={20} />
              <span>Ajustes</span>
            </a>
          </div>

        </aside>
      )}

    </div>
  );
}

export default Sidebar;