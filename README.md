<p align="center">
  <img src="public/favicon.svg" alt="SnapNote" width="80" height="80" />
</p>

<h1 align="center">SnapNote</h1>

<p align="center">
  Notas al estilo Notion, editor de código como VS Code, tareas diarias y temporizador Pomodoro, todo en una app web.
</p>

## Funcionalidades

- **Notas estilo Notion**
  - Editor a página completa: título grande, barra superior con la ruta (carpeta / nota) y, arriba a la derecha, el tipo de nota.
  - Tipos: Texto, Bash, Python, HTML, CSS, JavaScript, TypeScript, JSON, SQL y Markdown.
  - Se guardan solas mientras escribes y se pueden fijar en Inicio.
- **Carpetas**: organiza las notas en carpetas con emoji (Trabajo, Código, Tareas, Proyectos…), con árbol desplegable en la barra lateral.
- **Editor de código como VS Code**
  - Colores de los temas Dark+ y Light+, con corchetes de colores según el nivel de anidación.
  - `Ctrl + /` para comentar o descomentar.
  - Cierre automático de `( [ { " ' ``.
  - Indentación inteligente con Enter, Tab y Shift + Tab.
- **Tareas diarias**
  - Lista por día, con progreso y las pendientes de días anteriores.
  - Se pueden fijar en Inicio para marcarlas desde ahí.
- **Pomodoro**: trabajo, descanso corto y descanso largo configurables, con sonido opcional y la opción de empezar el siguiente bloque solo.
- **Calendario** mensual que también se puede fijar en Inicio.
- **Búsqueda** de notas por título, contenido o tipo.
- **Cuentas** con email y contraseña o con Google. Notas, tareas y ajustes se guardan en la nube y funcionan sin conexión.
- **Tema claro y oscuro** con los colores de Notion.

## Tecnologías

| | |
|---|---|
| Interfaz | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Herramienta de build | [Vite](https://vite.dev/) |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix) |
| Iconos | [Lucide](https://lucide.dev/) |
| Cuentas y base de datos | [Firebase](https://firebase.google.com/) (Authentication + Cloud Firestore) |
| Resaltado de código | [Prism](https://prismjs.com/) |
| Calidad de código | ESLint + typescript-eslint |

## Puesta en marcha

### Requisitos

- [Node.js](https://nodejs.org/) 20 o superior
- Un proyecto de [Firebase](https://console.firebase.google.com/) (el plan gratuito es suficiente)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. En la consola de Firebase, crea un proyecto y añade una **app web**.
2. En **Authentication → Método de inicio de sesión**, activa **Correo electrónico/contraseña** y **Google**.
3. En **Firestore Database**, crea la base de datos y, en la pestaña **Reglas**, pega el contenido de [`firestore.rules`](firestore.rules). Con estas reglas, cada usuario solo puede leer y escribir sus propios datos.
4. Copia `.env.example` como `.env.local` y rellénalo con la configuración de tu app web (Configuración del proyecto → Tus apps):

```bash
cp .env.example .env.local
```

> `.env.local` está en `.gitignore`: tus claves no se suben al repositorio.

### 3. Arrancar

```bash
npm run dev
```

Abre la URL que aparece en la terminal (por defecto `http://localhost:5173`).

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Comprueba los tipos y genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión de producción |
| `npm run lint` | Analiza el código con ESLint |

## Atajos de teclado

| Atajo | Acción |
|---|---|
| `Ctrl + .` | Abrir o cerrar la barra lateral |
| `Ctrl + /` | Comentar o descomentar líneas (notas de código) |
| `Tab` / `Shift + Tab` | Indentar o quitar indentación |
| `Enter` en el título | Saltar al contenido de la nota |

En Mac, `Ctrl` es `⌘`.

## Estructura del proyecto

```
SnapNote/
├── public/
│   └── favicon.svg          # Logo
├── src/
│   ├── main.tsx             # Punto de entrada
│   ├── App.tsx              # Login o app según la sesión
│   ├── Workspace.tsx        # App con la sesión iniciada: estado y navegación
│   ├── firebase.ts          # Configuración de Firebase
│   ├── index.css            # Tailwind, tema de shadcn/ui con los colores de Notion
│   ├── styles/
│   │   └── code.css         # Editor de código y colores de VS Code
│   ├── components/
│   │   ├── ui/              # Componentes de shadcn/ui
│   │   ├── SideBar.tsx      # Barra lateral con el árbol de carpetas
│   │   ├── NoteEditor.tsx   # Editor de notas estilo Notion
│   │   ├── CodeEditor.tsx   # Editor de código estilo VS Code
│   │   └── …                # Tarjetas, tareas, Pomodoro, menús…
│   ├── pages/               # Inicio, Notas, Tareas, Pomodoro, Calendario, Ajustes, Login
│   ├── hooks/               # Datos de Firebase (notas, carpetas, tareas, ajustes) y Pomodoro
│   ├── utils/               # Lógica sin interfaz: fechas, búsqueda, resaltado, atajos de código
│   ├── lib/utils.ts         # cn() para combinar clases de Tailwind (shadcn/ui)
│   └── types/               # Tipos compartidos
├── firestore.rules          # Reglas de seguridad de Firestore
├── components.json          # Configuración de shadcn/ui
├── eslint.config.js
└── vite.config.ts
```

### Datos en Firestore

```
users/{uid}                 # Ajustes y elementos fijados
users/{uid}/notes/{id}      # Notas
users/{uid}/folders/{id}    # Carpetas
users/{uid}/tasks/{id}      # Tareas
```

## Añadir componentes de shadcn/ui

```bash
npx shadcn@latest add <componente>
```

Los componentes se copian en `src/components/ui/` y se pueden modificar como cualquier otro archivo.
