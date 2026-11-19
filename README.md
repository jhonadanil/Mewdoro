<p align="center">
  <img src="public/favicon.svg" alt="Mewdoro" width="80" height="80" />
</p>

<h1 align="center">Mewdoro</h1>

<p align="center">
  Notas al estilo Notion, editor de código como VS Code, tareas flash, rutinas con seguimiento, calendario y temporizador Pomodoro, todo en una app web.
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
- **Tareas flash**
  - Lista por día, con progreso. Duran poco: al empezar un día nuevo se borran las completadas de días anteriores y las pendientes pasan solas a hoy.
  - Se pueden fijar en Inicio para marcarlas desde ahí.
- **Rutinas**
  - Hábitos que se repiten los días de la semana que elijas, con emoji y nombre; se pueden editar y eliminar (con «Deshacer»).
  - Seguimiento por semana o por mes: marca cada día lo que cumples, con racha (perdona un día fallado por semana), recuento de la semana y porcentaje de los últimos 30 días.
  - Lista «Hoy» para marcar rápido, vista adaptada a pantallas estrechas y mini-tarjeta para fijarlas en Inicio.
- **Pomodoro**: trabajo, descanso corto y descanso largo configurables, con sonido opcional y la opción de empezar el siguiente bloque solo.
- **Calendario** con vista semanal y mensual: cada día muestra sus tareas flash y sus rutinas. También se puede fijar en Inicio.
- **Búsqueda** de notas por título, contenido o tipo.
- **Landing y acceso**
  - Sin sesión, una página de presentación con una demo viva de Inicio (tareas, Pomodoro y rutinas con datos de ejemplo, sin guardar nada) y el editor de código de verdad.
  - Pantalla de inicio de sesión y de registro con etiquetas visibles, mostrar u ocultar la contraseña y botón para volver. Se navega con `#entrar` y `#registro`, así que el botón Atrás funciona.
- **Cuentas** con email y contraseña o con Google. Notas, tareas, rutinas y ajustes se guardan en la nube y funcionan sin conexión.
- **Tema claro y oscuro** con la paleta [Catppuccin](https://catppuccin.com/) (Latte y Mocha), formas redondeadas y superficies planas con borde fino, al estilo de la interfaz de Ollama.

## Tecnologías

| | |
|---|---|
| Interfaz | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Herramienta de build | [Vite](https://vite.dev/) |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix) |
| Iconos | [Phosphor](https://phosphoricons.com/) |
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

> Firebase solo deja iniciar sesión desde dominios autorizados. `localhost` viene autorizado; al publicar la app añade tu dominio (ver [Publicar](#publicar)).

### 3. Arrancar

```bash
npm run dev
```

Abre la URL que aparece en la terminal (por defecto `http://localhost:5173`).

## Publicar

1. Genera la versión de producción con `npm run build` (queda en `dist/`) y súbela a tu hosting estático (Firebase Hosting, Vercel, Netlify…).
2. Configura en el hosting las mismas variables de `.env.example` que usas en `.env.local`: Vite las incorpora al compilar.
3. En la consola de Firebase, ve a **Authentication → Configuración → Dominios autorizados** y añade el dominio de producción (por ejemplo `tuapp.web.app` o `mewdoro.com`, sin `https://`). Si falta, el inicio de sesión falla con `auth/unauthorized-domain`.
4. Comprueba que las reglas de Firestore sean las de [`firestore.rules`](firestore.rules) y no el modo de prueba, que caduca solo.

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
| `Alt + 1` … `Alt + 7` | Ir a Inicio, Notas, Pomodoro, Tareas flash, Calendario, Rutinas o Ajustes |
| `Ctrl + .` | Abrir o cerrar la barra lateral |
| `Ctrl + K` | Buscar notas |
| `Alt + N` | Añadir una tarea (en Inicio) |
| `Alt + P` | Iniciar o pausar el Pomodoro (en Inicio) |
| `Alt + R` | Marcar la siguiente rutina pendiente de hoy |
| `?` | Ver todos los atajos |
| `Ctrl + /` | Comentar o descomentar líneas (notas de código) |
| `Tab` / `Shift + Tab` | Indentar o quitar indentación |
| `Enter` en el título | Saltar al contenido de la nota |

En Mac, `Ctrl` es `⌘`.

## Estructura del proyecto

```
Mewdoro/
├── public/
│   └── favicon.svg          # Logo
├── src/
│   ├── main.tsx             # Punto de entrada
│   ├── App.tsx              # Landing, login o app según la sesión
│   ├── Workspace.tsx        # App con la sesión iniciada: estado y navegación
│   ├── firebase.ts          # Configuración de Firebase
│   ├── db.ts                # Acceso a Firestore
│   ├── index.css            # Tailwind, tema de shadcn/ui con la paleta Catppuccin
│   ├── styles/
│   │   └── code.css         # Editor de código y colores de VS Code
│   ├── components/
│   │   ├── ui/              # Componentes de shadcn/ui
│   │   ├── SideBar.tsx      # Barra lateral con el árbol de carpetas
│   │   ├── NoteEditor.tsx   # Editor de notas estilo Notion
│   │   ├── CodeEditor.tsx   # Editor de código estilo VS Code
│   │   ├── landing/         # Demo viva de la landing (cabina, semana, editor) y sus datos de ejemplo
│   │   └── …                # Tarjetas, tareas, rutinas, Pomodoro, menús…
│   ├── pages/               # Landing, Login, Inicio, Notas, Tareas flash, Pomodoro, Calendario, Rutinas, Ajustes
│   ├── hooks/               # Datos de Firebase (notas, carpetas, tareas, rutinas, ajustes) y Pomodoro
│   ├── utils/               # Lógica sin interfaz: fechas, rutinas (rachas, progreso), búsqueda, resaltado, atajos de código
│   ├── lib/utils.ts         # cn() para combinar clases de Tailwind (shadcn/ui)
│   └── types/               # Tipos compartidos
├── firestore.rules          # Reglas de seguridad de Firestore
├── PRODUCT.md               # Producto: público, tono y principios
├── DESIGN.md                # Sistema de diseño
├── components.json          # Configuración de shadcn/ui
├── eslint.config.js
└── vite.config.ts
```

### Datos en Firestore

```
users/{uid}                 # Ajustes y elementos fijados
users/{uid}/notes/{id}      # Notas
users/{uid}/folders/{id}    # Carpetas
users/{uid}/tasks/{id}      # Tareas flash
users/{uid}/routines/{id}   # Rutinas
users/{uid}/routineLogs/{id} # Días en que se cumplió cada rutina ({rutina}_{AAAA-MM-DD})
```

## Añadir componentes de shadcn/ui

```bash
npx shadcn@latest add <componente>
```

Los componentes se copian en `src/components/ui/` y se pueden modificar como cualquier otro archivo.
