import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import SearchBar from "./components/SearchBar";
import Sidebar from "./components/SideBar";
import Toaster from "./components/Toaster";
import { auth } from "./firebase";
import { useFolders } from "./hooks/useFolders";
import { useNotes } from "./hooks/useNotes";
import { useTasks } from "./hooks/useTasks";
import { PomodoroProvider } from "./hooks/PomodoroContext";
import { useUserData } from "./hooks/useUserData";
import { showToast } from "./utils/toast";
import Calendar from "./pages/Calendar";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import Pomodoro from "./pages/Pomodoro";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import type { FolderView, Page } from "./types";
import { createNote, filterByFolder, filterNotes, isEmptyNote } from "./utils/notes";
import { applyTheme } from "./utils/theme";

interface WorkspaceProps {
  user: User;
}

// La app para un usuario con la sesión iniciada; sus datos se guardan en Firebase
function Workspace({ user }: WorkspaceProps) {
  const [page, setPage] = useState<Page>("home");
  const [query, setQuery] = useState("");
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const [folderView, setFolderView] = useState<FolderView>("all");

  const { notes, loaded: notesLoaded, createNote: saveNewNote, updateNote, deleteNote, togglePin, flush, flushAll } = useNotes(user.uid);
  const { folders, createFolder, updateFolder, deleteFolder } = useFolders(user.uid);
  const { tasks, loaded: tasksLoaded, addTask, updateTask, deleteTask, moveTasks, deleteTasks } = useTasks(user.uid);
  const { settings, pinned, loaded: userLoaded, updateSettings, updatePinned } = useUserData(user.uid);

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  const filteredNotes = filterNotes(notes, query);
  const openNote = notes.find((note) => note.id === openNoteId);

  const closeNote = () => {
    if (!openNoteId) return;
    flush(openNoteId);
    // Una nota que se cierra vacía se descarta, como en Notion
    if (openNote && isEmptyNote(openNote)) deleteNote(openNoteId);
    setOpenNoteId(null);
  };

  const navigate = (nextPage: Page) => {
    closeNote();
    setPage(nextPage);
  };

  const openNoteById = (id: string) => {
    if (openNoteId !== id) closeNote();
    setPage("notes");
    setOpenNoteId(id);
  };

  const openFolder = (view: FolderView) => {
    closeNote();
    setPage("notes");
    setFolderView(view);
  };

  // Sin carpeta indicada, la nota se crea en la carpeta que se está viendo
  const addNote = (folderId: string | null = folders.some((folder) => folder.id === folderView) ? folderView : null) => {
    closeNote();
    const note = createNote(settings.defaultNoteType, folderId);
    saveNewNote(note);
    setPage("notes");
    setOpenNoteId(note.id);
  };

  // Desde la búsqueda sin resultados: la nota nueva se llama como lo que se buscaba
  const addNoteTitled = (title: string) => {
    closeNote();
    const note = { ...createNote(settings.defaultNoteType, null), title };
    saveNewNote(note);
    setQuery("");
    setPage("notes");
    setOpenNoteId(note.id);
  };

  // Botones de la bienvenida de Inicio: fijar una herramienta sin ir a su página
  const pinToHome = (key: keyof typeof pinned) => updatePinned({ [key]: true });

  const addFolder = () => {
    const folder = createFolder();
    openFolder(folder.id);
  };

  const removeFolder = (id: string) => {
    const noteIds = notes.filter((note) => note.folderId === id).map((note) => note.id);
    deleteFolder(id, noteIds);
    setFolderView("all");
  };

  const removeNote = (id: string) => {
    deleteNote(id);
    if (openNoteId === id) setOpenNoteId(null);
  };

  const changeQuery = (value: string) => {
    setQuery(value);
    // Al buscar se vuelve a la lista para ver los resultados
    closeNote();
  };

  // Quitar algo de Inicio se puede deshacer desde el aviso
  const unpinFromHome = (key: keyof typeof pinned, message: string) => {
    updatePinned({ [key]: false });
    showToast(message, { action: { label: "Deshacer", onClick: () => updatePinned({ [key]: true }) } });
  };

  const togglePinNote = (id: string) => {
    const wasPinned = notes.find((note) => note.id === id)?.pinned;
    togglePin(id);
    if (wasPinned) {
      showToast("Nota quitada de Inicio", { action: { label: "Deshacer", onClick: () => togglePin(id) } });
    }
  };

  const handleSignOut = () => {
    flushAll();
    signOut(auth);
  };

  return (
    <PomodoroProvider settings={settings}>
      <div className="flex min-h-screen">
        <Sidebar
          page={page}
          onNavigate={navigate}
          user={user}
          onSignOut={handleSignOut}
          notes={notes}
          folders={folders}
          folderView={folderView}
          openNoteId={openNoteId}
          onOpenFolder={openFolder}
          onOpenNote={openNoteById}
          onCreateNote={addNote}
          onCreateFolder={addFolder}
        />

        <main id="app-main" className="min-w-0 flex-1">
          <SearchBar
            query={query}
            onQueryChange={changeQuery}
            showSearch={page === "home" || (page === "notes" && !openNote)}
            theme={settings.theme}
            onToggleTheme={() => updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" })}
          />

          {page === "home" && (
            <Home
              notes={notes}
              folders={folders}
              query={query}
              searchResults={filteredNotes}
              isPomodoroPinned={pinned.pomodoro}
              onPinToHome={pinToHome}
              onCreateNote={() => addNote(null)}
              onCreateNoteTitled={addNoteTitled}
              loaded={notesLoaded && tasksLoaded && userLoaded}
              onUnpinPomodoro={() => unpinFromHome("pomodoro", "Pomodoro quitado de Inicio")}
              isCalendarPinned={pinned.calendar}
              onUnpinCalendar={() => unpinFromHome("calendar", "Calendario quitado de Inicio")}
              tasks={tasks}
              isTasksPinned={pinned.tasks}
              onUnpinTasks={() => unpinFromHome("tasks", "Tareas quitadas de Inicio")}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onNavigate={navigate}
              onOpenNote={openNoteById}
              onTogglePinNote={togglePinNote}
            />
          )}

          {page === "notes" && (
            <Notes
              notes={filterByFolder(filteredNotes, folders, folderView)}
              folders={folders}
              view={folderView}
              hasNotesWithoutFolder={filterByFolder(notes, folders, "none").length > 0}
              query={query}
              openNote={openNote}
              onChangeView={openFolder}
              onCreateFolder={addFolder}
              onUpdateFolder={updateFolder}
              onDeleteFolder={removeFolder}
              onCreate={() => addNote()}
              onOpen={setOpenNoteId}
              onClose={closeNote}
              onUpdate={updateNote}
              onDelete={removeNote}
              onTogglePin={togglePin}
            />
          )}

          {page === "pomodoro" && (
            <Pomodoro
              settings={settings}
              isPinned={pinned.pomodoro}
              onTogglePin={() => updatePinned({ pomodoro: !pinned.pomodoro })}
            />
          )}

          {page === "tasks" && (
            <Tasks
              tasks={tasks}
              isPinned={pinned.tasks}
              onTogglePin={() => updatePinned({ tasks: !pinned.tasks })}
              onAdd={addTask}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onMove={moveTasks}
              onDeleteMany={deleteTasks}
            />
          )}

          {page === "calendar" && (
            <Calendar
              isPinned={pinned.calendar}
              onTogglePin={() => updatePinned({ calendar: !pinned.calendar })}
            />
          )}

          {page === "settings" && (
            <Settings
              settings={settings}
              email={user.email}
              onChange={updateSettings}
              onSignOut={handleSignOut}
            />
          )}
        </main>

        {/* Avisos de error al guardar y "Deshacer" */}
        <Toaster />
      </div>
    </PomodoroProvider>
  );
}

export default Workspace;
