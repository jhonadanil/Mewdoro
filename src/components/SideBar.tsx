import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { CalendarDotsIcon, CaretDownIcon, CaretRightIcon, GearSixIcon, HouseIcon, ListChecksIcon, NotebookIcon, PlusIcon, SidebarSimpleIcon, SignOutIcon, TimerIcon } from "@phosphor-icons/react";
import type { User } from "firebase/auth";

import { IconButton } from "@/components/IconButton";
import { IS_MAC } from "../utils/platform";
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
  { page: "home", label: "Inicio", Icon: HouseIcon },
  { page: "notes", label: "Notas", Icon: NotebookIcon },
  { page: "pomodoro", label: "Pomodoro", Icon: TimerIcon },
  { page: "tasks", label: "Tareas", Icon: ListChecksIcon },
  { page: "calendar", label: "Calendario", Icon: CalendarDotsIcon },
] as const;



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
          {isExpanded ? <CaretDownIcon /> : <CaretRightIcon />}
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
          <PlusIcon />
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

// Por debajo de 768px (md) la barra lateral se comporta como panel flotante
const isNarrow = () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

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
  // En pantallas estrechas la barra empieza cerrada y, abierta, flota encima del contenido
  const [isOpen, setIsOpen] = useState(() => !isNarrow());
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const toggleRef = useRef<HTMLButtonElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  // Se sigue el ancho en vivo: al girar una tablet o ensanchar la ventana, la barra deja de ser panel
  const [narrow, setNarrow] = useState(isNarrow);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const handleChange = () => setNarrow(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

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

  // En móvil, al elegir una página o nota la barra se cierra para dejar ver el contenido
  useEffect(() => {
    if (isNarrow()) setIsOpen(false);
  }, [page, openNoteId, folderView]);

  // En móvil, abierta, la barra se comporta como un panel: el foco entra en ella, el contenido
  // de detrás no se puede recorrer con el teclado (inert) y Esc la cierra devolviendo el foco al botón
  useEffect(() => {
    if (!isOpen || !narrow) return;
    const main = document.getElementById("app-main");
    const toggle = toggleRef.current;
    if (main) main.inert = true;
    asideRef.current?.querySelector<HTMLElement>("nav a, nav button")?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // Al pasar a pantalla ancha el contenido se desbloquea aunque la barra siga abierta
      if (main) main.inert = false;
      // El foco solo vuelve al botón si se cerró la barra, no si cambió el ancho
      if (isNarrow()) toggle?.focus();
    };
  }, [isOpen, narrow]);

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
    <div
      className={cn(
        "group/sidebar relative shrink-0 transition-[width] duration-200 max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-40",
        isOpen ? "w-60" : "w-0"
      )}
    >
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
          isOpen
            ? "right-2 opacity-0 group-hover/sidebar:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
            : "-right-10"
        )}
        ref={toggleRef}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <SidebarSimpleIcon />
      </IconButton>

      {/* Velo detrás de la barra en móvil: tocar fuera la cierra */}
      {isOpen && (
        <div aria-hidden="true" className="fixed inset-0 -z-10 bg-black/30 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {isOpen && (
        <aside
          ref={asideRef}
          aria-label="Barra lateral"
          className="sticky top-0 flex h-screen w-60 flex-col border-r border-sidebar-border bg-sidebar px-2 pb-4 pt-2.5 text-sidebar-foreground"
        >
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
                    icon={<Icon weight={page === linkPage ? "fill" : "regular"} />}
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
                      <PlusIcon />
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
                        <PlusIcon className="size-3.5" />
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
            <NavItem icon={<GearSixIcon weight={page === "settings" ? "fill" : "regular"} />} label="Ajustes" isActive={page === "settings"} onClick={() => onNavigate("settings")} />
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
                <SignOutIcon />
              </IconButton>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

export default Sidebar;
