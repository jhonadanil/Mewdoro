import { Card } from "@/components/ui/card";
import { isFirebaseConfigured } from "./firebase";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Workspace from "./Workspace";

function AuthGate() {
  const user = useAuth();

  // Firebase todavía está comprobando si hay una sesión guardada
  if (user === undefined) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Cargando…</div>;
  }

  if (!user) return <Login />;

  // key: al cambiar de usuario se empieza de cero
  return <Workspace key={user.uid} user={user} />;
}

function App() {
  if (!isFirebaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md gap-3 px-7 py-8">
          <h1 className="text-2xl font-bold">Falta configurar Firebase</h1>
          <p className="leading-relaxed text-muted-foreground">
            Copia <code>.env.example</code> como <code>.env.local</code>, rellena los datos de tu proyecto de
            Firebase y reinicia <code>npm run dev</code>.
          </p>
        </Card>
      </div>
    );
  }

  return <AuthGate />;
}

export default App;
