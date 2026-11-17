import { isFirebaseConfigured } from "./firebase";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Workspace from "./Workspace";

function AuthGate() {
  const user = useAuth();

  // Firebase todavía está comprobando si hay una sesión guardada
  if (user === undefined) {
    return <div className="splash">Cargando…</div>;
  }

  if (!user) return <Login />;

  // key: al cambiar de usuario se empieza de cero
  return <Workspace key={user.uid} user={user} />;
}

function App() {
  if (!isFirebaseConfigured) {
    return (
      <div className="splash">
        <div className="splash__card">
          <h1 className="login__brand">Falta configurar Firebase</h1>
          <p className="page__text">
            Copia <code>.env.example</code> como <code>.env.local</code>, rellena los datos de tu proyecto de
            Firebase y reinicia <code>npm run dev</code>.
          </p>
        </div>
      </div>
    );
  }

  return <AuthGate />;
}

export default App;
