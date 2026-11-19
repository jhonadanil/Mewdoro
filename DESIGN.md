---
name: SnapNote
description: The day's cockpit for students and developers: notes, code, flash tasks, routines and focus on one calm screen.
colors:
  mauve-mocha: "#cba6f7"
  mauve-latte: "#8839ef"
  mocha-base: "#1e1e2e"
  mocha-mantle: "#181825"
  mocha-crust: "#11111b"
  mocha-surface: "#313244"
  mocha-input: "#45475a"
  mocha-text: "#cdd6f4"
  mocha-subtext: "#a6adc8"
  mocha-red: "#f38ba8"
  latte-base: "#eff1f5"
  latte-mantle: "#e6e9ef"
  latte-crust: "#dce0e8"
  latte-surface: "#ccd0da"
  latte-input: "#bcc0cc"
  latte-popover: "#fcfcfd"
  latte-text: "#4c4f69"
  latte-subtext: "#5c5f77"
  latte-red: "#d20f39"
  code-fondo: "#fcfcfd"
  code-fondo-noche: "#181825"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.25
  headline:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.375
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  task:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.4
  instrument:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
  caption:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, Menlo, Courier New, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "20px"
rounded:
  sm: "7.2px"
  md: "9.6px"
  lg: "12px"
  xl: "16.8px"
  2xl: "21.6px"
  pill: "9999px"
spacing:
  hair: "2px"
  xs: "4px"
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "24px"
  gutter: "48px"
components:
  button-primary:
    backgroundColor: "{colors.mauve-mocha}"
    textColor: "{colors.mocha-crust}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "36px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.mocha-text}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "36px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.mocha-subtext}"
    rounded: "{rounded.pill}"
    height: "36px"
  button-icon:
    backgroundColor: "transparent"
    textColor: "{colors.mocha-subtext}"
    rounded: "{rounded.pill}"
    size: "28px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.mocha-text}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "4px 16px"
    height: "36px"
  card:
    backgroundColor: "{colors.mocha-base}"
    textColor: "{colors.mocha-text}"
    rounded: "{rounded.2xl}"
    padding: "16px"
  card-mini:
    backgroundColor: "{colors.mocha-base}"
    rounded: "{rounded.2xl}"
    padding: "12px"
  popover:
    backgroundColor: "{colors.mocha-mantle}"
    textColor: "{colors.mocha-text}"
    rounded: "{rounded.xl}"
    padding: "10px"
  chip-folder:
    backgroundColor: "{colors.mocha-surface}"
    textColor: "{colors.mocha-text}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
    height: "20px"
  segmented-active:
    backgroundColor: "{colors.mocha-surface}"
    textColor: "{colors.mocha-text}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "4px 16px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.mocha-subtext}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
  nav-item-active:
    backgroundColor: "{colors.mocha-surface}"
    textColor: "{colors.mocha-text}"
  sidebar:
    backgroundColor: "{colors.mocha-mantle}"
    width: "240px"
  check-done:
    backgroundColor: "{colors.mauve-mocha}"
    textColor: "{colors.mocha-crust}"
    size: "28px"
    rounded: "{rounded.pill}"
---

# Design System: SnapNote

## Overview

**Creative North Star: "La cabina del día"**

SnapNote is the screen a student or developer keeps open all day. Home works like a cockpit: pinned notes, today's flash tasks, today's routines, the calendar and the running Pomodoro sit together as small instruments you can read at a glance and use without leaving the page. Every other page (Notas, Tareas flash, Pomodoro, Calendario, Rutinas, Ajustes) is the full-size version of one of those instruments.

The cockpit is calm and flat. Colors come from Catppuccin: Mocha in dark (the default theme) and Latte in light. Surfaces are flat panes separated by 1px borders, never by shadow or blur, and every control is a pill or a generously rounded card, in the manner of Ollama's interface. One accent, Mauve, lights up only when something is done, active or focused. The one place with full color is code, which renders in VS Code's Dark+ and Light+ token palettes because code notes are first-class.

The system keeps a Notion-like calm and structure but must not become a pixel copy of Notion or of Ollama. Its identity is the cockpit structure, the pinned mini-cards, the day-based tools (flash tasks that live one day, routines tracked by week) and the code surfaces.

**Key Characteristics:**
- Catppuccin Mocha / Latte neutrals with a single Mauve accent; no gradients, no blur, no acrylic.
- Flat 1px-bordered cards (21.6px corners) and pill-shaped buttons, inputs and selects.
- System sans for everything, monospace only inside code; Phosphor icons throughout.
- Compact controls (28-36px) that stay quiet until hover.
- Small pinned mini-cards on Home as read-and-act instruments: flash tasks, routines, calendar, Pomodoro.
- Code blocks in true VS Code colors, inside notes and on cards.
- Friendly details: emoji folders and routine icons, plain Spanish copy.

## Colors

Catppuccin in two themes: Mocha (dark, default) and Latte (light), with Mauve as the only accent. Every token exists in both themes.

### Primary
- **Mauve** (#cba6f7 Mocha / #8839ef Latte): the "done / on" color and the primary button. Checked routine and task boxes, progress bars, switches in the on state, full-day badges, the lit streak flame, selected day pills in forms and the focus ring. Text on Mauve is Crust (#11111b) in dark and white in light. It never decorates: if nothing is done, active or focused, no mauve should be showing, apart from the primary button.

### Neutral (dark theme, Mocha, default)
- **Base** (#1e1e2e): page and card background. **Mantle** (#181825): sidebar, popovers, muted fills and the code background. **Crust** (#11111b): text on Mauve.
- **Surface** (#313244): borders, secondary fills, hover and active rows. **Input** (#45475a): field strokes.
- **Text** (#cdd6f4) and **Subtext** (#a6adc8): primary and secondary text (7:1 or better on Base). **Red** (#f38ba8): destructive.

### Neutral (light theme, Latte)
- **Base** (#eff1f5): page and card background. **Mantle** (#e6e9ef): sidebar, secondary and muted fills. **Crust** (#dce0e8): hover and active rows. **Popover** (#fcfcfd): menus and popovers.
- **Surface** (#ccd0da): borders. **Input** (#bcc0cc): field strokes.
- **Text** (#4c4f69) and **Subtext** (#5c5f77, 5.7:1 on Base): primary and secondary text. **Red** (#d20f39): destructive.

### Code
Code surfaces use their own token set (`--code-*` in `src/styles/code.css`): VS Code Light+ on **Código Fondo** (#fcfcfd) and Dark+ token colors on **Código Fondo Noche** (#181825, the Mantle), with three-step bracket-pair colors. Token colors belong to code only.

### Named Rules
**The Lit-When-Done Rule.** Mauve appears only on completed, active or focused things, plus the single primary button. A mauve that is just decoration is a bug. "Today" is never mauve: it is marked with inverted text color (a Text-colored pill with Base text), so it cannot be confused with "done".

**The Code Keeps Its Colors Rule.** Syntax colors never leak into the interface, and the interface palette never recolors code.

**The Both-Themes Rule.** Every color is defined for Mocha and Latte. Unchecked control borders sit at 80% of the subtext color so they hold 3:1 against the page in both themes.

## Typography

**Body Font:** the system UI stack (`ui-sans-serif`, `system-ui`, `-apple-system`, Segoe UI, Roboto), so it works offline and matches the platform. **Mono Font:** `ui-monospace`, SFMono, Consolas, Menlo.

**Character:** plain, legible and quiet. Hierarchy comes from weight and size, never from a second display face.

### Hierarchy
- **Display** (700, 40px, 1.25): the note title in the full-page editor only.
- **Headline** (700, 1.875rem, 1.2, -0.025em): page titles (Inicio, Notas, Tareas flash, Rutinas...). On Home it is the Home Title, which settles on today's date.
- **Title** (600, 1rem, 1.375): note-card titles and card headings; 0.875rem on compact cards.
- **Body** (400, 0.875rem, 1.5): default UI and card text. Note body text runs in a column of at most 708px.
- **Label** (400, 13px, 1.4): sidebar folder and note rows, secondary stats.
- **Task** (400, 15px, 1.4): task text on the Tareas flash page; compact rows stay at 13px.
- **Caption** (500, 0.75rem): chips, badges, day counters, hints. Nothing is set below 12px.
- **Mono** (400, 13px, 20px line): code editor and code previews. The 20px line is structural: the highlighted layer and the textarea must align pixel for pixel.
- **Instrument numerals:** the mini Pomodoro time is 28px bold with `tabular-nums`; day counts and streaks also use tabular numerals.

### Named Rules
**The One Family Rule.** Only the system sans and the code mono. No second UI face, no decorative display face, no CDN fonts.

## Layout

Two panes: a 240px sidebar (collapsible with `Ctrl + .`, animating its width over 200ms) and a centered content column. Below 768px the sidebar starts closed and opens as a floating panel with a 30% black scrim; it behaves like a panel (focus moves in, main content is `inert`, Esc closes). Pages use a 960px max width with 24px side padding, growing to 48px from `sm`. Narrow pages (Rutinas, Ajustes, Tareas flash) inset their content to 760px with the same left edge; Calendario uses the full width. The note editor centers a 708px reading column.

Sidebar order: Inicio, Notas (with its emoji folder tree), Pomodoro, Tareas flash, Calendario, Rutinas, then Ajustes. Alt + 1...7 jumps to each.

Home reads in three bands: **the day** (date title and a one-line status), **the tools** (a container-query grid: one column, two from 28rem, three from 48rem; Tareas flash leads and spans two columns) and **Notas fijadas** under a small muted h2. Pinnable tools: Tareas flash, Rutinas, Pomodoro, Calendario.

**Rutinas** reads top-down: a "Hoy" checklist (wide screens), week navigation with a Semana / Mes switch, the week table (routines by days) or the month calendar, then a Seguimiento list with streak, weekly count and 30-day adherence. Below 768px the table becomes a 7-day strip plus the chosen day's list with 44px checks. **Calendario** has the same Semana / Mes switch: seven day cards or a month grid, each showing the day's flash tasks and routines.

Rhythm is tight inside a band and generous between bands, on Tailwind's 4px grid. Density is moderate: more air than a dev tool, less than a marketing page.

## Elevation & Depth

**Depth is a border.** Surfaces are flat. A 1px border in the Surface color separates cards, tables and the sidebar from the page; nothing blurs and cards carry no shadow. Floating layers (menus, selects, popovers, toasts) have a 1px border and one very soft shadow.

### Shadow Vocabulary
- **Floating** (`box-shadow: 0 4px 16px -4px rgb(0 0 0 / 0.1)`): dropdown menus, sub-menus, selects, popovers and note-card hover actions. Always paired with the 1px border.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. The only shadow in the system is the soft Floating shadow on layers that sit above the page. Hover on cards darkens the border (to 30% foreground); it never adds a shadow.

## Shapes

Round and soft, in the Ollama manner, from a single 12px root radius (`--radius: 0.75rem`): 7.2px for tiny controls, 9.6px for nav rows, 12px for large controls, 16.8px for popovers, dialogs and menus, 21.6px for cards, tables and day tiles. **Buttons, icon buttons, inputs, selects, chips, switch tracks, segmented controls, day toggles and checks are full pills / circles.** Borders are 1px hairlines. Nothing is sharp-cornered, nothing is a blob.

## Components

### Buttons
Pills, quiet by default: most are outline or ghost.
- **Shape:** full pill (9999px); heights 24 / 32 / 36 / 40px (`xs`, `sm`, default, `lg`), icon buttons 24-32px circles.
- **Primary:** Mauve fill with Crust text (Latte: white), 36px high, 16px horizontal padding, medium weight. Hover drops to 80% opacity. Reserved for the single main action of a context (save, add, create the first one).
- **Outline:** 1px border, Base fill; hover fills Mantle. Header actions such as "Nueva rutina", "Fijar en inicio".
- **Ghost:** transparent with Subtext text; hover fills the muted color.
- **Pressed:** 1px downward nudge. **Focus:** Mauve border with a 3px ring at 50%.
- **Destructive:** Red text on a 10% red tint (20% in dark).
- Icon buttons always carry a tooltip naming the action, plus its shortcut when there is one.

### Segmented switch
A pill with a 1px border and 2px padding holding two or three pill buttons (Semana | Mes). The active option is filled with the Surface color and Text-colored text; the others are Subtext. Mauve is not used here, because choosing a view is not "done".

### Chips
- **Style:** Surface pill, 20px high, caption type, with the folder emoji before the name.
- **Use:** folder labels on note cards and the label on Home mini-cards, which can open the full page.

### Cards / Containers
- **Corner Style:** 21.6px. **Background:** Base (same as the page). **Border:** 1px Surface. **Shadow:** none.
- **Internal Padding:** 16px by default, 12px for compact cards.
- **Hover actions** (pin, delete) float top-right in a small popover pane and fade in on hover or focus; on touch screens they are always visible.

### Inputs / Fields
- **Style:** transparent fill, 1px Input stroke, full pill, 36px high, 16px horizontal padding.
- **Focus:** Mauve border plus a 3px ring at 50% (the search field only darkens its border).
- **Error / Disabled:** Red border with a 20% ring; disabled drops to 50% opacity.
- **Inline title:** the note title is a borderless 40px input with a 30% placeholder, the only input with no visible chrome.

### Day check (signature)
The 28px circle used by routines (44px on touch). Unchecked: a 1px border at 80% Subtext. Done: filled Mauve with a bold check. Days when the routine does not apply are a quiet 6px dot; future days are disabled at 50% opacity; a mark that already exists is always shown and can always be undone. Checks are real buttons with `aria-pressed` and a label that names routine and date.

### Pinned Mini-Card
A compact card with a chip label top-left (opens the full page) and an unpin icon top-right, holding a live miniature of a tool: today's flash tasks, today's routines, the month, or the running timer in 28px tabular numerals. A running Pomodoro lights its border Mauve.

### Home Title
The Home headline plays its phrases once on arrival and then settles; it never loops while the user works. With pins it greets by time of day and settles on today's date (*Martes, 17 de noviembre*). With nothing pinned the title is just the greeting plus one sentence and buttons: **Nueva nota** (primary) and outline **Fijar Tareas / Rutinas / Pomodoro / Calendario**. Under the date, a one-line status built only from real state ("2 de 5 tareas flash hechas · Trabajo en marcha, quedan 12 min"). Motion: each phrase holds 2.4s, the outgoing one rises and blurs over 320ms, the incoming one enters over 700ms with `cubic-bezier(0.16, 1, 0.3, 1)`; under `prefers-reduced-motion` the final phrase shows directly. Component: `src/components/RotatingTitle.tsx`.

### Code Block
Code in notes and card previews keeps VS Code colors: 13px mono, 9.6px radius, 1px code border and the code background. Code stays on solid surfaces so the token colors read exactly as in VS Code. It clamps to 3 lines on compact cards and 6 otherwise.

### Navigation
- **Sidebar:** Mantle with a 1px right border. Nav rows are 14px Subtext with 18px Phosphor icons (fill weight on the active row) and 9.6px corners. Hover and active rows fill Surface and brighten the text; the active row turns medium weight.
- **Folder tree:** 13px rows with emoji and chevron. The "+" for a new note appears only on row hover. Notes indent 32px under their folder.

### Toasts
Bottom-center pane with a 1px border, at most two at a time. Each has its own timer: 5s, 8s for errors. Errors say what failed and offer **Reintentar** (repeats the exact failed write) or **Recargar**; removals and routine/task marks offer **Deshacer**.

## Do's and Don'ts

### Do:
- **Do** keep Mauve for done, active, focused and the single primary button.
- **Do** mark "today" with inverted text color, never with Mauve.
- **Do** define every color for Mocha and Latte, and design dark first.
- **Do** make buttons, inputs, selects and chips pills, and cards 21.6px with a 1px border.
- **Do** separate surfaces with a border; keep depth to the Floating shadow on layers above the page.
- **Do** make anything pinnable usable in its mini-card form on Home.
- **Do** give every icon button a tooltip in Spanish, plus its shortcut when one exists.
- **Do** render code with the `--code-*` tokens and the 20px mono line.
- **Do** use Phosphor icons in the regular weight, `fill` only to mark the active item or a lit streak.
- **Do** keep text at 12px or larger, and touch targets at 44px where the layout is touch-first.

### Don't:
- **Don't** add a second accent color, gradients, glows or blur to panes, text or controls.
- **Don't** use hard or colored shadows.
- **Don't** put code on a translucent surface or recolor it with interface colors.
- **Don't** add a second UI font or CDN-loaded fonts.
- **Don't** mix icon families; interface icons come from Phosphor (routine and folder icons are user-chosen emoji).
- **Don't** let a view switch, a header action or "today" borrow the Mauve reserved for done.
- **Don't** turn SnapNote into a pixel copy of Notion or Ollama; the cockpit structure, mini-cards, day-based tools and code surfaces carry the identity.
