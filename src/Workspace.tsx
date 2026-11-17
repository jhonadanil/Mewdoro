import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import SearchBar from "./components/SearchBar";
import Sidebar from "./components/SideBar";
import { auth } from "./firebase";
import { useFolders } from "./hooks/useFolders";
import { useNotes } from "./hooks/useNotes";
import { useTasks } from "./hooks/useTasks";
import { usePomodoro } from "./hooks/usePomodoro";
import { useUserData } from "./hooks/useUserData";
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

  const { notes, createNote: saveNewNote, updateNote, deleteNote, togglePin, flush, flushAll } = useNotes(user.uid);
  const { folders, createFolder, updateFolder, deleteFolder } = useFolders(user.uid);
  const { tasks, addTask, updateTask, deleteTask, moveTasks, deleteTasks } = useTasks(user.uid);
  const { settings, pinned, updateSettings, updatePinned } = useUserData(user.uid);
  const pomodoro = usePomodoro(settings);

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

  const handleSignOut = () => {
    flushAll();
    signOut(auth);
  };

  return (
    <div className="flex min-h-screen bg-background">
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

      <main className="min-w-0 flex-1">
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
            pomodoro={pomodoro}
            isPomodoroPinned={pinned.pomodoro}
            onUnpinPomodoro={() => updatePinned({ pomodoro: false })}
            isCalendarPinned={pinned.calendar}
            onUnpinCalendar={() => updatePinned({ calendar: false })}
            tasks={tasks}
            isTasksPinned={pinned.tasks}
            onUnpinTasks={() => updatePinned({ tasks: false })}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onNavigate={navigate}
            onOpenNote={openNoteById}
            onTogglePinNote={togglePin}
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
            pomodoro={pomodoro}
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
    </div>
  );
}

export default Workspace;
