import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { CalendarDotsIcon, CaretDownIcon, CaretRightIcon, GearSixIcon, HouseIcon, ListChecksIcon, NotebookIcon, PlusIcon, RepeatIcon, SidebarSimpleIcon, SignOutIcon, TimerIcon } from "@phosphor-icons/react";
import type { User } from "firebase/auth";

import { IconButton } from "@/components/IconButton";
import { Button } from "@/components/ui/button";
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

// Alt + número lleva a cada sección (el número es el de su tecla, ver PAGE_KEYS)
const LINKS = [
  { page: "home", label: "Inicio", Icon: HouseIcon, key: "1" },
  { page: "notes", label: "Notas", Icon: NotebookIcon, key: "2" },
  { page: "pomodoro", label: "Pomodoro", Icon: TimerIcon, key: "3" },
  { page: "tasks", label: "Tareas flash", Icon: ListChecksIcon, key: "4" },
  { page: "calendar", label: "Calendario", Icon: CalendarDotsIcon, key: "5" },
  { page: "routines", label: "Rutinas", Icon: RepeatIcon, key: "6" },
] as const;
const SETTINGS_KEY = "7";

// Tecla (event.code, para que funcione igual con cualquier distribución de teclado) → página
const PAGE_KEYS: Record<string, Page> = {
  ...Object.fromEntries(LINKS.map((link) => [`Digit${link.key}`, link.page])),
  [`Digit${SETTINGS_KEY}`]: "settings",
};

interface NavItemProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  // Número del atajo Alt + número; se enseña al pasar el ratón
  shortcutKey: string;
  // Deja hueco a la derecha para un botón que aparece encima (el + de Notas)
  hasAction?: boolean;
  // Solo en Notas: indica si el árbol de carpetas está desplegado
  expanded?: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, isActive, shortcutKey, hasAction, expanded, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-keyshortcuts={`Alt+${shortcutKey}`}
      className={cn(
        "group/nav flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground [&_svg]:size-[18px]",
        isActive && "bg-sidebar-accent font-medium text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
      <KbdGroup
        aria-hidden="true"
        className={cn("ml-auto opacity-0 transition-opacity group-hover/nav:opacity-100", hasAction && "mr-6")}
      >
        <Kbd>Alt</Kbd>
        <Kbd>{shortcutKey}</Kbd>
      </KbdGroup>
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
  // Las carpetas solo se ven tras pulsar Notas, y siguen visibles hasta que se vuelve a pulsar
  const [showFolders, setShowFolders] = useState(false);
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

  // Al abrir una carpeta desde la barra también se despliegan sus notas (la flecha sigue sirviendo para plegarla)
  const openFolder = (id: string) => {
    setExpanded((current) => (current.has(id) ? current : new Set(current).add(id)));
    onOpenFolder(id);
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
      // Abierta y cerrada son botones distintos: se lee la ref ahora, que ya apunta al de abrir
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (isNarrow()) toggleRef.current?.focus();
    };
  }, [isOpen, narrow]);

  // Alt + 1…7 lleva a cada sección desde cualquier sitio, también mientras se escribe y con la barra cerrada
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey ? PAGE_KEYS[event.code] : undefined;
      if (!target) return;
      event.preventDefault();
      if (target === "notes") onOpenFolder("all");
      else onNavigate(target);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNavigate, onOpenFolder]);

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
      {/* Abierta: el botón solo aparece al pasar el ratón por la barra, y su atajo, al pasar por el botón,
          con las mismas teclas grises que las secciones (sin tooltip). Cerrada: siempre visible, con tooltip */}
      {isOpen ? (
        <div className="group/toggle absolute right-2 top-2 z-20 flex items-center gap-1.5">
          <KbdGroup aria-hidden="true" className="pointer-events-none opacity-0 transition-opacity group-hover/toggle:opacity-100">
            <Kbd>{IS_MAC ? "⌘" : "Ctrl"}</Kbd>
            <Kbd>.</Kbd>
          </KbdGroup>
          <Button
            ref={toggleRef}
            variant="ghost"
            size="icon-sm"
            aria-label="Cerrar barra lateral"
            aria-keyshortcuts="Control+Period"
            aria-expanded={true}
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground opacity-0 hover:text-foreground group-hover/sidebar:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 [&_svg]:size-[18px]"
          >
            <SidebarSimpleIcon />
          </Button>
        </div>
      ) : (
        <IconButton
          label="Abrir barra lateral"
          aria-keyshortcuts="Control+Period"
          shortcut={
            <KbdGroup>
              <Kbd>{IS_MAC ? "⌘" : "Ctrl"}</Kbd>
              <Kbd>.</Kbd>
            </KbdGroup>
          }
          side="right"
          className="absolute -right-10 top-2 z-20 [&_svg]:size-[18px]"
          ref={toggleRef}
          aria-expanded={false}
          onClick={() => setIsOpen(true)}
        >
          <SidebarSimpleIcon />
        </IconButton>
      )}

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
            {LINKS.map(({ page: linkPage, label, Icon, key }) => (
              <div key={linkPage}>
                <div className="group/link relative">
                  <NavItem
                    icon={<Icon weight={page === linkPage ? "fill" : "regular"} />}
                    label={label}
                    isActive={page === linkPage}
                    shortcutKey={key}
                    hasAction={linkPage === "notes"}
                    expanded={linkPage === "notes" ? showFolders : undefined}
                    onClick={() => {
                      if (linkPage !== "notes") return onNavigate(linkPage);
                      setShowFolders((show) => !show);
                      onOpenFolder("all");
                    }}
                  />

                  {/* Como en Notion: el + para crear carpeta aparece al pasar el ratón */}
                  {linkPage === "notes" && (
                    <IconButton
                      label="Nueva carpeta"
                      size="icon-xs"
                      side="right"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover/link:opacity-100 focus-visible:opacity-100"
                      // Se despliegan las carpetas para que se vea la nueva
                      onClick={() => {
                        setShowFolders(true);
                        onCreateFolder();
                      }}
                    >
                      <PlusIcon />
                    </IconButton>
                  )}
                </div>

                {/* Árbol de carpetas debajo de Notas */}
                {linkPage === "notes" && showFolders && (
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
                        onOpen={() => openFolder(folder.id)}
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
                        onOpen={() => openFolder("none")}
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
            <NavItem icon={<GearSixIcon weight={page === "settings" ? "fill" : "regular"} />} label="Ajustes" isActive={page === "settings"} shortcutKey={SETTINGS_KEY} onClick={() => onNavigate("settings")} />
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
