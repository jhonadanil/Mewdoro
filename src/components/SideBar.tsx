import { useEffect, useState } from "react";

import {
  House,
  NotebookPen,
  Timer,
  ListChecks,
  CalendarDays,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ChevronDown,
  ChevronRight,
  Plus
} from "lucide-react";
import type { User } from "firebase/auth";

import type { Folder, FolderView, Note, Page } from "../types";
import { filterByFolder } from "../utils/notes";

interface SidebarProps {
  page: Page;
  onNavigate: (page: Page) => void;
  user: User;
  onSignOut: () => void;
  notes: Note[];
  folders: Folder[];
  folderView: FolderView;
  openNoteId: string | null;
  onOpenFolder: (view: FolderView) => void;
  onOpenNote: (id: string) => void;
  onCreateNote: (folderId: string | null) => void;
  onCreateFolder: () => void;
}

const LINKS = [
  { page: "home", label: "Inicio", Icon: House },
  { page: "notes", label: "Notas", Icon: NotebookPen },
  { page: "pomodoro", label: "Pomodoro", Icon: Timer },
  { page: "tasks", label: "Tareas", Icon: ListChecks },
  { page: "calendar", label: "Calendario", Icon: CalendarDays },
] as const;

const IS_MAC = /Mac|iPhone|iPad/.test(navigator.userAgent);

interface FolderRowProps {
  icon: string;
  name: string;
  notes: Note[];
  isActive: boolean;
  isExpanded: boolean;
  openNoteId: string | null;
  onToggle: () => void;
  onOpen: () => void;
  onOpenNote: (id: string) => void;
  onCreateNote: () => void;
}

// Una carpeta del árbol, que se despliega para ver sus notas (como en Notion)
function FolderRow({
  icon,
  name,
  notes,
  isActive,
  isExpanded,
  openNoteId,
  onToggle,
  onOpen,
  onOpenNote,
  onCreateNote,
}: FolderRowProps) {
  return (
    <div>
      <div className={`tree-row ${isActive ? "tree-row--active" : ""}`}>
        <button
          type="button"
          className="tree-row__chevron"
          onClick={onToggle}
          aria-label={isExpanded ? "Contraer carpeta" : "Desplegar carpeta"}
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <button type="button" className="tree-row__label" onClick={onOpen}>
          <span className="tree-row__icon">{icon}</span>
          <span className="tree-row__name">{name}</span>
        </button>
        <button
          type="button"
          className="tree-row__add"
          onClick={onCreateNote}
          aria-label="Nueva nota en esta carpeta"
          title="Nueva nota en esta carpeta"
        >
          <Plus size={14} />
        </button>
      </div>

      {isExpanded && (
        notes.length === 0 ? (
          <p className="tree-empty">Sin notas</p>
        ) : (
          notes.map((note) => (
            <button
              key={note.id}
              type="button"
              className={`tree-note ${openNoteId === note.id ? "tree-note--active" : ""}`}
              onClick={() => onOpenNote(note.id)}
              title={note.title || "Sin título"}
            >
              {note.title || "Sin título"}
            </button>
          ))
        )
      )}
    </div>
  );
}

function Sidebar({
  page,
  onNavigate,
  user,
  onSignOut,
  notes,
  folders,
  folderView,
  openNoteId,
  onOpenFolder,
  onOpenNote,
  onCreateNote,
  onCreateFolder,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [hasPhotoError, setHasPhotoError] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const name = user.displayName || user.email || "Mi cuenta";
  const initial = name.charAt(0).toUpperCase();
  const notesWithoutFolder = filterByFolder(notes, folders, "none");

  const toggleExpanded = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isFolderActive = (view: FolderView) => page === "notes" && folderView === view && !openNoteId;

  // Atajo para abrir y cerrar la barra: Ctrl + . (Cmd + . en Mac), también mientras se escribe
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && (event.key === "." || event.code === "Period")) {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleLabel = isOpen ? "Cerrar barra lateral" : "Abrir barra lateral";

  return (
    <div className={`sidebar-container ${isOpen ? "sidebar-container--open" : "sidebar-container--closed"}`}>
      <button
        className="sidebar__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={toggleLabel}
        aria-keyshortcuts="Control+Period"
      >
        {isOpen ? (
          <PanelLeftClose size={18} />
        ) : (
          <PanelLeftOpen size={18} />
        )}

        {/* Aviso con el atajo al pasar el ratón, como en Notion */}
        <span className="tooltip" role="tooltip">
          {toggleLabel}
          <span className="tooltip__keys">
            <kbd>{IS_MAC ? "⌘" : "Ctrl"}</kbd>
            <kbd>.</kbd>
          </span>
        </span>
      </button>

      {isOpen && (
        <aside className="sidebar">
          <div className="sidebar__brand">
            <img src="/favicon.svg" alt="" width={22} height={22} />
            <span>SnapNote</span>
          </div>

          {/* Navegación principal */}
          <nav className="sidebar__menu">
            {LINKS.map(({ page: linkPage, label, Icon }) => (
              <div key={linkPage}>
                <div className="sidebar__link-row">
                  <button
                    type="button"
                    className={`sidebar__link ${page === linkPage ? "sidebar__link--active" : ""}`}
                    onClick={() => (linkPage === "notes" ? onOpenFolder("all") : onNavigate(linkPage))}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </button>

                  {/* Como en Notion: el + para crear carpeta aparece al pasar el ratón */}
                  {linkPage === "notes" && (
                    <button
                      type="button"
                      className="sidebar__link-add"
                      onClick={onCreateFolder}
                      aria-label="Nueva carpeta"
                      title="Nueva carpeta"
                    >
                      <Plus size={15} />
                    </button>
                  )}
                </div>

                {/* Árbol de carpetas debajo de Notas */}
                {linkPage === "notes" && (
                  <div className="sidebar__tree">
                    {folders.map((folder) => (
                      <FolderRow
                        key={folder.id}
                        icon={folder.icon}
                        name={folder.name || "Sin título"}
                        notes={notes.filter((note) => note.folderId === folder.id)}
                        isActive={isFolderActive(folder.id)}
                        isExpanded={expanded.has(folder.id)}
                        openNoteId={openNoteId}
                        onToggle={() => toggleExpanded(folder.id)}
                        onOpen={() => onOpenFolder(folder.id)}
                        onOpenNote={onOpenNote}
                        onCreateNote={() => onCreateNote(folder.id)}
                      />
                    ))}

                    {notesWithoutFolder.length > 0 && (
                      <FolderRow
                        icon="📄"
                        name="Sin carpeta"
                        notes={notesWithoutFolder}
                        isActive={isFolderActive("none")}
                        isExpanded={expanded.has("none")}
                        openNoteId={openNoteId}
                        onToggle={() => toggleExpanded("none")}
                        onOpen={() => onOpenFolder("none")}
                        onOpenNote={onOpenNote}
                        onCreateNote={() => onCreateNote(null)}
                      />
                    )}

                    {/* Sin carpetas, se muestra el atajo para que se sepa cómo crear una */}
                    {folders.length === 0 && (
                      <button type="button" className="tree-new" onClick={onCreateFolder}>
                        <Plus size={14} />
                        <span>Nueva carpeta</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Ajustes y cuenta abajo */}
          <div className="sidebar__bottom">
            <button
              type="button"
              className={`sidebar__link ${page === "settings" ? "sidebar__link--active" : ""}`}
              onClick={() => onNavigate("settings")}
            >
              <Settings size={18} />
              <span>Ajustes</span>
            </button>

            <div className="sidebar__account">
              {user.photoURL && !hasPhotoError ? (
                <img
                  className="sidebar__avatar"
                  src={user.photoURL}
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={() => setHasPhotoError(true)}
                />
              ) : (
                <span className="sidebar__avatar">{initial}</span>
              )}

              <div className="sidebar__account-info">
                <span className="sidebar__account-name" title={name}>{name}</span>
                {user.displayName && user.email && (
                  <span className="sidebar__account-email" title={user.email}>{user.email}</span>
                )}
              </div>

              <button
                type="button"
                className="icon-btn"
                onClick={onSignOut}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

export default Sidebar;
