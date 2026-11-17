import { Card } from "@/components/ui/card";
import { isFirebaseConfigured } from "./firebase";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import { lazy, Suspense } from "react";

// La app con sesión (Firestore, editor, páginas) va en un archivo aparte. Se empieza a descargar
// en cuanto carga la página, en paralelo, así el login aparece antes y la app no espera de más.
const loadWorkspace = () => import("./Workspace");
void loadWorkspace();
const Workspace = lazy(loadWorkspace);

const loading = <div className="flex min-h-screen items-center justify-center text-muted-foreground">Cargando…</div>;

function AuthGate() {
  const user = useAuth();

  // Firebase todavía está comprobando si hay una sesión guardada
  if (user === undefined) {
    return loading;
  }

  if (!user) return <Login />;

  // key: al cambiar de usuario se empieza de cero
  return (
    <Suspense fallback={loading}>
      <Workspace key={user.uid} user={user} />
    </Suspense>
  );
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
