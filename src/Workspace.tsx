import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import MobileNav from "./components/MobileNav";
import SearchBar from "./components/SearchBar";
import Sidebar from "./components/SideBar";
import Toaster from "./components/Toaster";
import { auth } from "./firebase";
import { useIsMobile } from "./hooks/useIsMobile";
import { useFolders } from "./hooks/useFolders";
import { useNotes } from "./hooks/useNotes";
import { useRoutines } from "./hooks/useRoutines";
import { useTasks } from "./hooks/useTasks";
import { PomodoroProvider } from "./hooks/PomodoroContext";
import { useUserData } from "./hooks/useUserData";
import { showToast } from "./utils/toast";
import { countsOn, hasLog } from "./utils/routines";
import { todayKey } from "./utils/tasks";
import Calendar from "./pages/Calendar";
import Home from "./pages/Home";
import HomeMobile from "./pages/HomeMobile";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import Pomodoro from "./pages/Pomodoro";
import Routines from "./pages/Routines";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import type { FolderView, Page } from "./types";
import { createNote, filterByFolder, filterNotes, isEmptyNote } from "./utils/notes";
import { deleteAccount, hasPasswordLogin } from "./utils/account";
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
  const isMobile = useIsMobile();

  const { notes, loaded: notesLoaded, createNote: saveNewNote, updateNote, deleteNote, togglePin, flush, flushAll } = useNotes(user.uid);
  const { folders, createFolder, updateFolder, deleteFolder } = useFolders(user.uid);
  const { tasks, loaded: tasksLoaded, addTask, updateTask, deleteTask, deleteTasks } = useTasks(user.uid);
  const { routines, logs: routineLogs, loaded: routinesLoaded, addRoutine, updateRoutine, deleteRoutine, restoreRoutine, setDone: setRoutineDone } = useRoutines(user.uid);
  const { settings, pinned, loaded: userLoaded, updateSettings, updatePinned } = useUserData(user.uid);

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  // Alt + R marca la siguiente rutina pendiente de hoy desde cualquier página
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.code !== "KeyR") return;
      event.preventDefault();
      const today = todayKey();
      const due = routines.filter((routine) => countsOn(routine, routineLogs, today));
      const next = due.find((routine) => !hasLog(routineLogs, routine, today));
      if (next) {
        setRoutineDone(next.id, today, true);
        showToast(`Marcada: ${next.icon} ${next.name}`, { action: { label: "Deshacer", onClick: () => setRoutineDone(next.id, today, false) } });
      } else {
        showToast(due.length === 0 ? "Hoy no toca ninguna rutina" : "Rutinas de hoy terminadas");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [routines, routineLogs, setRoutineDone]);

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

  // Sin carpeta indicada, la nota se crea suelta (sin carpeta); luego se arrastra a una carpeta
  const addNote = (folderId: string | null = null) => {
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
        <div className="contents max-md:hidden">
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
          onMoveNote={(noteId, folderId) => updateNote(noteId, { folderId })}
        />
        </div>

        <main id="app-main" className={`min-w-0 flex-1 ${isMobile && !openNote ? "pb-20" : ""}`}>
          <SearchBar
            query={query}
            onQueryChange={changeQuery}
            showSearch={(page === "home" && !isMobile) || (page === "notes" && !openNote)}
            theme={settings.theme}
            onToggleTheme={() => updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" })}
          />

          {page === "home" && isMobile && (
            <HomeMobile
              loaded={notesLoaded && tasksLoaded && routinesLoaded}
              notes={notes}
              tasks={tasks}
              routines={routines}
              routineLogs={routineLogs}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onSetRoutineDone={setRoutineDone}
              onNavigate={navigate}
              onOpenNote={openNoteById}
            />
          )}

          {page === "home" && !isMobile && (
            <Home
              notes={notes}
              folders={folders}
              query={query}
              searchResults={filteredNotes}
              isPomodoroPinned={pinned.pomodoro}
              onPinToHome={pinToHome}
              onCreateNote={() => addNote(null)}
              onCreateNoteTitled={addNoteTitled}
              loaded={notesLoaded && tasksLoaded && userLoaded && routinesLoaded}
              onUnpinPomodoro={() => unpinFromHome("pomodoro", "Pomodoro quitado de Inicio")}
              isCalendarPinned={pinned.calendar}
              calendarView={pinned.calendarView}
              onUnpinCalendar={() => unpinFromHome("calendar", "Calendario quitado de Inicio")}
              tasks={tasks}
              isTasksPinned={pinned.tasks}
              onUnpinTasks={() => unpinFromHome("tasks", "Tareas flash quitadas de Inicio")}
              routines={routines}
              routineLogs={routineLogs}
              isRoutinesPinned={pinned.routines}
              onUnpinRoutines={() => unpinFromHome("routines", "Rutinas quitadas de Inicio")}
              onSetRoutineDone={setRoutineDone}
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
              onChangeSettings={updateSettings}
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
              onDeleteMany={deleteTasks}
            />
          )}

          {page === "calendar" && (
            <Calendar
              isPinned={pinned.calendar}
              onTogglePin={(view) => updatePinned({ calendar: !pinned.calendar, calendarView: view })}
              defaultView={settings.calendarView}
              tasks={tasks}
              routines={routines}
              logs={routineLogs}
            />
          )}

          {page === "routines" && (
            <Routines
              routines={routines}
              logs={routineLogs}
              loaded={routinesLoaded}
              isPinned={pinned.routines}
              onTogglePin={() => updatePinned({ routines: !pinned.routines })}
              onAdd={addRoutine}
              onUpdate={updateRoutine}
              onDelete={deleteRoutine}
              onRestore={restoreRoutine}
              onSetDone={setRoutineDone}
            />
          )}

          {page === "profile" && (
            <Profile user={user} routines={routines} logs={routineLogs} onOpenRoutines={() => navigate("routines")} />
          )}

          {page === "settings" && (
            <Settings
              settings={settings}
              email={user.email}
              onChange={updateSettings}
              onSignOut={handleSignOut}
              hasPassword={hasPasswordLogin(user)}
              onDeleteAccount={(password) => deleteAccount(user, password)}
            />
          )}
        </main>

        {isMobile && !openNote && <MobileNav page={page} user={user} onNavigate={navigate} />}

        {/* Avisos de error al guardar y "Deshacer" */}
        <Toaster />
      </div>
    </PomodoroProvider>
  );
}

export default Workspace;
