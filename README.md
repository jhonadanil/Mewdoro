# SnapNote

Aplicación web para tomar notas rápidas y mantener la concentración con un temporizador Pomodoro. Construida con **React 19**, **TypeScript** y **Vite**, con una interfaz inspirada en Notion y soporte para modo claro y oscuro.

> 🚧 Proyecto en desarrollo.

## Funcionalidades

- **Notas**: crear notas con título y contenido, y eliminarlas.
- **Temporizador Pomodoro**: bloques de 25 minutos de trabajo y 5 de descanso, con alternancia automática, pausa y reinicio.
- **Barra lateral plegable** con navegación a Inicio, Notas, Pomodoro y Ajustes.
- **Barra de búsqueda** de notas.
- **Modo claro / oscuro**, guardado en `localStorage`.

## Estado actual

- `App.tsx` por ahora solo muestra la barra lateral y la barra de búsqueda. Las páginas `Home`, `Notes` y `Pomodoro` ya existen, pero todavía no están conectadas a la navegación.
- La búsqueda aún no filtra notas.
- Las notas se guardan solo en memoria: se pierden al recargar la página.

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
    │   └── index.ts          # Tipos compartidos (Note, Page)
    ├── components/
    │   ├── SideBar.tsx       # Navegación lateral plegable
    │   ├── SearchBar.tsx     # Búsqueda y cambio de tema
    │   ├── NoteCard.tsx      # Tarjeta de una nota
    │   ├── PomodoroTimer.tsx # Lógica y vista del temporizador
    │   └── Navbar.tsx        # (vacío por ahora)
    └── pages/
        ├── Home.tsx          # Página de bienvenida
        ├── Notes.tsx         # Crear y listar notas
        └── Pomodoro.tsx      # Página del temporizador
```

## Próximos pasos

- [ ] Conectar la navegación de la barra lateral con las páginas
- [ ] Hacer que la búsqueda filtre las notas
- [ ] Guardar las notas en `localStorage`
- [ ] Editar notas existentes
- [ ] Página de ajustes (por ejemplo, duración del Pomodoro)
