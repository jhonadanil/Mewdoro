
import SearchBar from "./components/SearchBar";
import Sidebar from "./components/Sidebar";

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
