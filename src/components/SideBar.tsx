import { useEffect, useState } from "react";
import type { ReactNode } from "react";

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

import { IconButton } from "@/components/IconButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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

interface NavItemProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground [&_svg]:size-[18px]",
        isActive && "bg-sidebar-accent font-medium text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

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
      <div className={cn("group/row flex items-center rounded-md hover:bg-sidebar-accent", isActive && "bg-sidebar-accent")}>
        <IconButton label={isExpanded ? "Contraer carpeta" : "Desplegar carpeta"} size="icon-xs" side="right" onClick={onToggle}>
          {isExpanded ? <ChevronDown /> : <ChevronRight />}
        </IconButton>
        <button
          type="button"
          onClick={onOpen}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-1.5 px-1 py-1.5 text-left text-[13px] text-muted-foreground group-hover/row:text-foreground",
            isActive && "text-foreground"
          )}
        >
          <span className="shrink-0 text-sm">{icon}</span>
          <span className="truncate">{name}</span>
        </button>
        {/* El + solo aparece al pasar el ratón, como en Notion */}
        <IconButton
          label="Nueva nota en esta carpeta"
          size="icon-xs"
          side="right"
          className="mr-0.5 opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100"
          onClick={onCreateNote}
        >
          <Plus />
        </IconButton>
      </div>

      {isExpanded &&
        (notes.length === 0 ? (
          <p className="py-1 pl-8 pr-2 text-xs italic text-muted-foreground">Sin notas</p>
        ) : (
          notes.map((note) => (
            <button
              key={note.id}
              type="button"
              onClick={() => onOpenNote(note.id)}
              title={note.title || "Sin título"}
              className={cn(
                "block w-full truncate rounded-md py-1 pl-8 pr-2 text-left text-[13px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                openNoteId === note.id && "bg-sidebar-accent text-foreground"
              )}
            >
              {note.title || "Sin título"}
            </button>
          ))
        ))}
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
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const name = user.displayName || user.email || "Mi cuenta";
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

  return (
    <div className={cn("group/sidebar relative shrink-0 transition-[width] duration-200", isOpen ? "w-60" : "w-0")}>
      {/* Con la barra abierta el botón solo aparece al pasar el ratón; cerrada, siempre visible */}
      <IconButton
        label={isOpen ? "Cerrar barra lateral" : "Abrir barra lateral"}
        aria-keyshortcuts="Control+Period"
        shortcut={
          <KbdGroup>
            <Kbd>{IS_MAC ? "⌘" : "Ctrl"}</Kbd>
            <Kbd>.</Kbd>
          </KbdGroup>
        }
        side={isOpen ? "bottom" : "right"}
        className={cn(
          "absolute top-2 z-20 [&_svg]:size-[18px]",
          isOpen ? "right-2 opacity-0 group-hover/sidebar:opacity-100 focus-visible:opacity-100" : "-right-10"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
      </IconButton>

      {isOpen && (
        <aside className="sticky top-0 flex h-screen w-60 flex-col border-r border-sidebar-border bg-sidebar px-2 pb-4 pt-2.5 text-sidebar-foreground">
          {/* Logo y nombre arriba, como el espacio de trabajo en Notion */}
          <div className="mb-3 flex h-8 items-center gap-2 px-2 pr-10 text-sm font-semibold">
            <img src="/favicon.svg" alt="" width={22} height={22} />
            <span>SnapNote</span>
          </div>

          {/* Navegación principal */}
          <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
            {LINKS.map(({ page: linkPage, label, Icon }) => (
              <div key={linkPage}>
                <div className="group/link relative">
                  <NavItem
                    icon={<Icon />}
                    label={label}
                    isActive={page === linkPage}
                    onClick={() => (linkPage === "notes" ? onOpenFolder("all") : onNavigate(linkPage))}
                  />

                  {/* Como en Notion: el + para crear carpeta aparece al pasar el ratón */}
                  {linkPage === "notes" && (
                    <IconButton
                      label="Nueva carpeta"
                      size="icon-xs"
                      side="right"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover/link:opacity-100 focus-visible:opacity-100"
                      onClick={onCreateFolder}
                    >
                      <Plus />
                    </IconButton>
                  )}
                </div>

                {/* Árbol de carpetas debajo de Notas */}
                {linkPage === "notes" && (
                  <div className="mb-2 ml-3.5 mt-0.5 flex flex-col">
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
                      <button
                        type="button"
                        onClick={onCreateFolder}
                        className="flex items-center gap-1.5 rounded-md px-1.5 py-1.5 text-left text-[13px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      >
                        <Plus className="size-3.5" />
                        <span>Nueva carpeta</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Ajustes y cuenta abajo */}
          <div className="flex flex-col gap-2">
            <NavItem icon={<Settings />} label="Ajustes" isActive={page === "settings"} onClick={() => onNavigate("settings")} />
            <Separator />
            <div className="flex items-center gap-2.5 pl-2.5 pr-1">
              <Avatar className="size-7">
                <AvatarImage src={user.photoURL ?? undefined} alt="" referrerPolicy="no-referrer" />
                <AvatarFallback className="text-xs font-semibold">{name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[13px]" title={name}>{name}</span>
                {user.displayName && user.email && (
                  <span className="truncate text-xs text-muted-foreground" title={user.email}>{user.email}</span>
                )}
              </div>
              <IconButton label="Cerrar sesión" side="top" onClick={onSignOut}>
                <LogOut />
              </IconButton>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

export default Sidebar;
