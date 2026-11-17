import SearchBar from "./components/SearchBar";
import Sidebar from "./components/SideBar";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="app__content">
        <SearchBar />
      </main>
    </div>
  );
}

export default App;
