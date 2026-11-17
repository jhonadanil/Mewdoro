# SnapNote

Aplicación web para tomar notas rápidas y mantener la concentración con un temporizador Pomodoro. Construida con **React 19**, **TypeScript** y **Vite**, con una interfaz inspirada en Notion y soporte para modo claro y oscuro.

> 🚧 Proyecto en desarrollo.

## Funcionalidades

- **Notas estilo Notion**: editor a página completa con título grande, tipo de nota (Texto, Bash, Python, HTML, CSS, JavaScript, TypeScript, JSON, SQL, Markdown) y contenido. Las notas de código usan fuente monoespaciada y Tab inserta espacios. Se guardan en `localStorage`.
- **Temporizador Pomodoro**: bloques de 25 minutos de trabajo y 5 de descanso, con alternancia automática, pausa, reinicio y barra de progreso. Sigue corriendo aunque cambies de página.
- **Inicio**: puedes fijar el Pomodoro, el calendario y tus notas para verlos en tarjetas pequeñas.
- **Calendario**: vista mensual que empieza en lunes y resalta el día de hoy.
- **Búsqueda** por título, contenido o tipo, solo en Inicio y Notas.
- **Barra lateral plegable** con navegación entre páginas.
- **Modo claro / oscuro**, guardado en `localStorage`.

## Tecnologías

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [lucide-react](https://lucide.dev/) para los iconos
- ESLint

## Requisitos

- [Node.js](https://nodejs.org/) 20 o superior
- npm

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

Luego abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

### Scripts disponibles

| Comando           | Descripción                                        |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo con recarga en caliente |
| `npm run build`   | Comprueba los tipos y genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión de producción          |
| `npm run lint`    | Analiza el código con ESLint                       |

## Estructura del proyecto

```
SnapNote/
├── index.html
├── vite.config.ts
└── src/
    ├── main.tsx              # Punto de entrada
    ├── App.tsx               # Componente raíz
    ├── index.css             # Estilos globales y variables de tema
    ├── types/
    │   └── index.ts          # Tipos compartidos (Note, NoteType, Page)
    ├── hooks/
    │   ├── useLocalStorage.ts # useState que persiste en localStorage
    │   └── usePomodoro.ts    # Lógica del temporizador
    ├── utils/
    │   ├── notes.ts          # Tipos de nota, búsqueda y fechas
    │   └── calendar.ts       # Cálculo de los días del mes
    ├── components/
    │   ├── SideBar.tsx       # Navegación lateral plegable
    │   ├── SearchBar.tsx     # Búsqueda y cambio de tema
    │   ├── NoteCard.tsx      # Tarjeta de una nota (normal y compacta)
    │   ├── NoteEditor.tsx    # Editor de notas estilo Notion
    │   ├── PomodoroTimer.tsx # Vista del temporizador
    │   ├── MiniPomodoro.tsx  # Pomodoro pequeño para Inicio
    │   ├── MiniCalendar.tsx  # Calendario pequeño para Inicio
    │   └── Navbar.tsx        # (vacío por ahora)
    └── pages/
        ├── Home.tsx          # Página de bienvenida
        ├── Notes.tsx         # Crear y listar notas
        ├── Pomodoro.tsx      # Página del temporizador
        └── Calendar.tsx      # Calendario mensual
```

## Próximos pasos

- [ ] Resaltado de sintaxis en las notas de código
- [ ] Página de ajustes (por ejemplo, duración del Pomodoro)
