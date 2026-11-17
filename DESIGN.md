---
name: SnapNote
description: The day's cockpit for students and developers: notes, code, tasks and focus on one calm screen.
colors:
  lavanda-hecha: "#7a5af8"
  lavanda-hecha-noche: "#9b7bff"
  tinta-violeta: "#2e2a38"
  papel-lila: "#fcfbfe"
  blanco: "#ffffff"
  lila-niebla: "#f6f4fa"
  lila-hueso: "#eeebf4"
  lila-bruma: "#f1eff6"
  lapiz-violeta: "#6a6478"
  linea-lila: "#e8e5ef"
  borde-campo: "#e0dcea"
  barra-lila: "#f8f6fb"
  rojo-aviso: "#e03e3e"
  noche: "#16141b"
  noche-tarjeta: "#1d1a24"
  noche-flotante: "#221f2a"
  noche-relieve: "#2a2633"
  noche-linea: "#2d2937"
  noche-campo: "#3a3545"
  tiza: "#e7e3ee"
  ceniza: "#a29bb0"
  rojo-aviso-noche: "#eb5757"
  codigo-fondo-noche: "#252130"
  codigo-fondo: "#ffffff"
  fondo-acrilico: "#f5f3f8"
  fondo-acrilico-noche: "#121016"
  mancha-lavanda: "#9682d2"
  mancha-malva: "#beaac8"
  mancha-pizarra: "#a0aac3"
  mancha-violeta-noche: "#6e5aaa"
  mancha-ciruela-noche: "#785a82"
  mancha-pizarra-noche: "#46506e"
  acrilico-tarjeta: "#ffffff9e"
  acrilico-tarjeta-noche: "#241f3085"
  acrilico-flotante: "#ffffffc7"
  acrilico-flotante-noche: "#221e2cd1"
  acrilico-barra: "#ffffff6b"
  acrilico-barra-noche: "#1e1a2873"
  velo-lavanda: "#7a5af81a"
typography:
  display:
    fontFamily: "Figtree Variable, ui-sans-serif, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.25
  headline:
    fontFamily: "Figtree Variable, ui-sans-serif, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Figtree Variable, ui-sans-serif, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.375
  body:
    fontFamily: "Figtree Variable, ui-sans-serif, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Figtree Variable, ui-sans-serif, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  task:
    fontFamily: "Figtree Variable, ui-sans-serif, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.4
  instrument:
    fontFamily: "Figtree Variable, ui-sans-serif, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
  caption:
    fontFamily: "Figtree Variable, ui-sans-serif, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
  mono:
    fontFamily: "Consolas, SFMono-Regular, Menlo, Courier New, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "20px"
rounded:
  sm: "4.8px"
  md: "6.4px"
  lg: "8px"
  xl: "11.2px"
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
    backgroundColor: "{colors.tinta-violeta}"
    textColor: "{colors.blanco}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.lapiz-violeta}"
    rounded: "{rounded.lg}"
    height: "32px"
  button-ghost-hover:
    backgroundColor: "{colors.lila-bruma}"
    textColor: "{colors.tinta-violeta}"
  button-icon:
    backgroundColor: "transparent"
    textColor: "{colors.lapiz-violeta}"
    rounded: "{rounded.md}"
    size: "28px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-violeta}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "4px 10px"
    height: "32px"
  card:
    backgroundColor: "{colors.acrilico-tarjeta}"
    textColor: "{colors.tinta-violeta}"
    rounded: "{rounded.xl}"
    padding: "16px"
  card-mini:
    backgroundColor: "{colors.acrilico-tarjeta}"
    rounded: "{rounded.xl}"
    padding: "12px"
  chip-folder:
    backgroundColor: "{colors.lila-hueso}"
    textColor: "{colors.tinta-violeta}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
    height: "20px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.lapiz-violeta}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
  nav-item-active:
    backgroundColor: "{colors.velo-lavanda}"
    textColor: "{colors.tinta-violeta}"
  sidebar:
    backgroundColor: "{colors.acrilico-barra}"
    width: "240px"
  checkbox-done:
    backgroundColor: "{colors.lavanda-hecha}"
    textColor: "{colors.blanco}"
    size: "18px"
---

# Design System: SnapNote

## Overview

**Creative North Star: "La cabina del día"**

SnapNote is the screen a student or developer keeps open all day. Home works like a cockpit: pinned notes, today's tasks, the calendar and the running Pomodoro sit together as small instruments you can read at a glance and use without leaving the page. Every other page (Notas, Tareas, Pomodoro, Calendario, Ajustes) is the full-size version of one of those instruments.

The cockpit is friendly, not technical. Neutrals carry a quiet violet tint ("Violeta nocturno"), and emoji folder icons, softly rounded corners and plain Spanish copy ("Sin título", "Quitar de inicio") make it feel like a personal desk at night rather than a control room. The instruments are made of acrylic: the sidebar, cards, menus and toasts are frosted, translucent panes over a fixed backdrop of three faint, muted color fields from the same lilac family (lavender, mauve and slate; dusky violet, plum and night slate in dark) with a fine grain, in the spirit of Windows 11 Fluent acrylic. The backdrop is deliberately quiet, a tint you sense rather than see, and it is the only ambient color. On the panes themselves color stays almost absent, and a single lavender (Lavanda Hecha) lights up only when something is done or switched on. The one place with full color is code, which renders in VS Code's Dark+ and Light+ token palettes because code notes are first-class.

The system keeps the calm structure and system type of a Notion-style workspace but must not become a pixel copy of Notion. Its own identity comes from the violet-tinted palette, the acrylic material, the cockpit structure, the pinned mini-cards and the code surfaces. Dark is the default theme and light is a full equal.

**Key Characteristics:**
- Acrylic panes over a fixed, barely-there lilac color-field backdrop with grain: cards and sidebar are translucent with a light top edge; floating layers add a 16px frost (1.15 saturation).
- Violet-tinted neutral text and a single lavender status accent; no gradients on surfaces, text or buttons.
- Figtree for everything, monospace only inside code; Phosphor icons throughout.
- Compact controls (28–32px) that stay quiet until hover.
- Small pinned mini-cards on Home, as read-and-act instruments, under a title that greets once and settles on today's date.
- Code blocks in true VS Code colors, inside notes and on cards.
- Friendly details: emoji folders, rounded corners, plain-language labels.

## Colors

"Violeta nocturno" in acrylic: neutrals tinted toward violet with one functional lavender, laid as translucent panes over a soft color-field backdrop, mirrored for a dark theme that is the default.

### Primary
- **Lavanda Hecha** (#7a5af8 light / Lavanda Hecha Noche #9b7bff dark): the "done / on" color. Checked task boxes, progress bars, switches in the on state, and the focus ring. It never decorates. If nothing on the screen is complete, active or focused, no lavender should be showing. The light-theme value is deeper so it holds 4.4:1 on the page and 4.5:1 under the white check mark.

### Acrylic backdrop and panes
The backdrop is fixed to the viewport (`body::before` and `body::after` in `src/index.css`), so it stays put while content scrolls and shows through every pane.
- **Fondo Acrílico** (#f5f3f8 light / Fondo Acrílico Noche #121016 dark): the base color under the color fields.
- **Color fields:** three wide radial pools of desaturated tones from one family, kept faint so the backdrop never competes with content: **Mancha Lavanda** (#9682d2 at 16%, top left), **Mancha Malva** (#beaac8 at 14%, right) and **Mancha Pizarra** (#a0aac3 at 14%, bottom). In dark: **Mancha Violeta Noche** (#6e5aaa at 16%), **Mancha Ciruela Noche** (#785a82 at 10%) and **Mancha Pizarra Noche** (#46506e at 12%). Saturated or multi-hue pools were tried and rejected as too loud for an all-day tool.
- **Grain:** an SVG fractal-noise layer at 3.5% opacity (5% in dark), the texture that makes the panes read as material rather than as flat transparency.
- **Panes:** `--card` is white at 62% (night `rgb(36 31 48)` at 52%), `--popover` white at 78% (`rgb(34 30 44)` at 82%), `--sidebar` white at 42% (`rgb(30 26 40)` at 45%). Only floating layers carry `backdrop-filter: blur(16px) saturate(1.15)` through `--acrylic-blur`: menus, selects, popovers, dialogs and any element with the `.acrylic` class (toast, note-card actions), because only they have content behind them. Cards and the sidebar sit directly on the smooth backdrop, where a blur is invisible but still costs a repaint on every scroll, so they are translucent only and the grain shows through them.
- **Hairlines on glass:** borders and input strokes are Tinta Violeta at 9% and 14% (Tiza at 8% and 14% in dark), so they take on whatever is behind them.
- **Fallback:** where `backdrop-filter` is unsupported, `--card`, `--popover` and `--sidebar` revert to solid Lila Niebla, Blanco and Barra Lila (Noche Tarjeta, Noche Flotante and Noche Tarjeta in dark) so text stays legible.

### Neutral (light theme)
- **Tinta Violeta** (#2e2a38): body text, headings and the solid primary button. A violet-black, never pure black.
- **Papel Lila** (#fcfbfe): page background. **Blanco** (#ffffff): popovers and text on solid buttons.
- **Lila Niebla** (#f6f4fa) and **Barra Lila** (#f8f6fb): the solid card and sidebar fallbacks when acrylic is unavailable.
- **Lila Hueso** (#eeebf4): secondary buttons and folder chips.
- **Velo Lavanda** (Lavanda Hecha at 10%; the night lavender at 14% in dark): hover and active sidebar rows.
- **Lila Bruma** (#f1eff6): ghost-button hover and muted fills.
- **Lápiz Violeta** (#6a6478): secondary text, idle icons, placeholders. Reaches at least 4.6:1 on every light surface.
- **Línea Lila** (#e8e5ef) and **Borde Campo** (#e0dcea): the opaque equivalents of the translucent border and input strokes.
- **Rojo Aviso** (#e03e3e): destructive actions only, usually as a 10% tint behind red text.

### Neutral (dark theme, default)
- **Noche** (#16141b): opaque background where no backdrop shows. **Noche Tarjeta** (#1d1a24): solid card and sidebar fallback. **Noche Flotante** (#221f2a): popovers and muted fills. **Noche Relieve** (#2a2633): secondary buttons, chips, active nav rows. **Noche Línea** (#2d2937): borders. **Noche Campo** (#3a3545): input strokes.
- **Tiza** (#e7e3ee): text and the solid primary button. **Ceniza** (#a29bb0): secondary text (5.5:1 or better). **Rojo Aviso Noche** (#eb5757): destructive.

### Code
Code surfaces use their own token set (`--code-*` in `src/styles/code.css`): VS Code Light+ on **Código Fondo** (#ffffff) and Dark+ token colors on **Código Fondo Noche** (#252130), with three-step bracket-pair colors. The dark code background is a violet-tinted night, a step lighter than the panes, instead of VS Code's neutral #1e1e1e, which read as a black hole next to the violet surfaces; every Dark+ token holds at least 4.5:1 on it, with regex nudged to #d67272 and the line-number gutter to a violet gray #8f8b98 to get there. These colors belong to code only.

### Named Rules
**The Lit-When-Done Rule.** Lavanda Hecha appears only on completed, active or focused things. A lavender that is just decoration is a bug.

**The Backdrop-Only Color Rule.** Ambient color lives only in the fixed backdrop behind the glass. Panes, text and controls never get gradients or tints of their own; the color reaches them only through the blur.

**The Code Keeps Its Colors Rule.** Syntax colors never leak into the interface, and the interface palette never recolors code.

## Typography

**Body Font:** Figtree (variable, bundled through `@fontsource-variable/figtree` so it works offline), falling back to the system sans stack.
**Mono Font:** Consolas (with SFMono-Regular, Menlo, Courier New).

**Character:** geometric but warm, very legible at small sizes; friendly without being childish. Hierarchy comes from weight and size, never from a second display face.

### Hierarchy
- **Display** (700, 40px, 1.25): the note title in the full-page editor only.
- **Headline** (700, 1.875rem, 1.2, −0.025em): page titles (Inicio, Notas, Tareas…). On Home it is the Home Title, which settles on today's date (see Components).
- **Title** (600, 1rem, 1.375): note-card titles and card headings. Drops to 0.875rem on compact cards.
- **Body** (400, 0.875rem, 1.5): the default UI and card text. Note body text runs in a column of at most 708px.
- **Label** (400, 13px, 1.4): sidebar folder and note rows.
- **Task** (400, 15px, 1.4): task text and the new-task field on the Tareas page, a half-step above body so a day's list reads comfortably; compact mini-card rows stay at 13px.
- **Caption** (500, 0.75rem): chips, badges, empty-state hints, compact card previews.
- **Mono** (400, 13px, 20px line): code editor and code previews. The 20px line height is structural, because the highlighted layer and the textarea must line up pixel for pixel.
- **Instrument numerals:** the mini Pomodoro time is 28px bold with `tabular-nums`, so the digits don't jitter as they tick.

### Named Rules
**The One Family Rule.** Only Figtree and the code mono. No second UI face, no decorative display face, and no fonts loaded from a CDN (the app must work offline).

## Layout

The app has two panes: a 240px sidebar (collapsible with `Ctrl + .`, animating its width over 200ms) and a centered content column. Below 768px the sidebar starts closed and opens as a floating panel over the content with a 30% black scrim; tapping the scrim, pressing Esc, or choosing a page or note closes it. While open on a narrow screen it behaves like a panel: focus moves to its first link, the main content is `inert`, and closing returns focus to the toggle button. Pages use a 960px max width with 24px side padding, growing to 48px from `sm` up, and 10px top / 48px bottom padding. Narrow pages (Calendario, Ajustes, Tareas) inset their content to 760px while keeping the same left edge. The note editor centers a 708px reading column.

Home reads in three bands, in this order: **the day** (date title, then the status line 6px below), **the tools** (24px below), and **Notas fijadas** (40px below, under a small 14px semibold muted h2). The tools grid is driven by its own width through container queries: one column, two from 28rem, three from 48rem; Tareas always leads and spans two columns from 28rem so its list and label never truncate, followed by Pomodoro and Calendario. Pinned notes are large reading cards in flowing CSS columns: one column, two from 36rem of their own width, 16px apart, so cards of different heights stack without gaps. The tools grid uses a 12px gap and aligns to the top so cards keep their natural height; search results keep small 200px cards. While searching, Home shows results under "Resultados" and keeps a running or paused Pomodoro as a status line above them; with no results it offers one primary button, **Crear nota «…»**, that creates a note titled with the search. In the tasks mini-card every task is in the list (overdue first, then today, always in their own order so nothing jumps when checked); the list is a scroll area about seven rows tall with the same bottom fade as pinned notes, and adding a task scrolls it to the end so the new one is visible. Shared component: `src/components/ScrollArea.tsx`. The rhythm is tight inside a band and generous between bands, on Tailwind's 4px grid. Density is moderate: more air than a dev tool, less than a marketing page.

## Elevation & Depth

**Depth is acrylic.** Surfaces lift off the page as frosted glass: a translucent fill that blurs and saturates the color-field backdrop, a light catch on the top edge, and a soft ambient shadow. The amount of frost says how high a layer sits. The sidebar is the thinnest pane (42% / 45%), cards are in the middle (62% / 52%) and floating layers are the most opaque (78% / 82%), so text on a menu always reads cleanly over whatever is underneath.

### Shadow Vocabulary
- **Acrylic edge** (`inset 0 1px 0 rgb(255 255 255 / 0.7)`, 6% in dark): the light catch along the top edge of every card.
- **Acrylic lift** (`0 1px 2px rgb(46 42 56 / 0.04), 0 8px 24px -8px rgb(76 56 140 / 0.14)`; dark `0 1px 2px rgb(0 0 0 / 0.2), 0 10px 30px -10px rgb(0 0 0 / 0.5)`): the resting card shadow. It is set through `--tw-shadow`, so it stacks with the card's 1px ring at 10% foreground (25% on hover) instead of replacing it.
- **Floating** (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`): menus, popovers, select lists and toasts, always paired with the 10% ring.
- **Floating high** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): submenus.

### Named Rules
**The Soft-Lift Rule.** Any depth stays soft and ambient: low opacity, wide blur, no hard drop shadows, no colored glows. Depth says "this sits on top", never "look at me".

**The Frost-By-Height Rule.** The higher a layer sits, the more opaque its pane. A floating layer is never more transparent than the surface it covers.

## Shapes

Gently curved throughout, from a single 8px root radius (`--radius: 0.5rem`): 4.8px for tiny controls, 6.4px for nav rows and icon buttons, 8px for buttons and inputs, 11.2px for cards. Chips and badges are full pills. Task checkboxes are nearly square at 4px. Borders are hairline (1px) and lilac-tinted. Nothing is sharp-cornered and nothing is a blob.

## Components

### Buttons
Soft and discreet: most buttons are ghosts that show up on hover.
- **Shape:** gently rounded (8px); icon buttons 6.4px.
- **Primary:** Tinta Violeta fill with Blanco text (Tiza / Noche in dark), 32px high, 10px horizontal padding, medium weight. Hover drops to 80% opacity.
- **Ghost:** transparent with Lápiz Violeta text. Hover fills Lila Bruma and darkens the text. This is the default for icon buttons.
- **Pressed:** a 1px downward nudge (`translate-y-px`).
- **Focus:** the border turns Lavanda Hecha, with a 3px ring at 50% Lavanda Hecha.
- **Destructive:** Rojo Aviso text on a 10% red tint (20% in dark).
- **Icon buttons** always carry a tooltip that names the action, plus its shortcut when there is one.

### Chips
- **Style:** Lila Hueso pill, 20px high, caption type, with the folder emoji before the name.
- **Use:** folder labels on note cards and the label on Home mini-cards, which can open the full page.

### Pinned Note Card (Home)
The `pinned` variant of NoteCard, for reading on Home rather than recognizing: 20px padding, no ring at rest (the translucent pane and acrylic lift separate it; the 25% ring appears on hover), the folder as a quiet 12px muted line instead of a chip, a 16px semibold title, and text at 14px with relaxed leading in 80% foreground. Instead of clamping, the content is a fixed-height scroll area (192px for text, 224px for code) that scrolls with the wheel when hovered, or with the arrow keys after tabbing to it (it is a labelled `region`); `overscroll-contain` keeps the page still at the ends. While more content sits below, the bottom 40px fades out through a mask, and the fade disappears at the end, so the overflow is visible without hovering. The title is the button that opens the note; a click on the content also opens it unless text is being selected. In the other variants (Notas page, search) the whole card is the button and the excerpt clamps; code clamps on an inner element so the next line never peeks through the block's padding.

### Cards / Containers
- **Corner Style:** 11.2px.
- **Background:** translucent acrylic pane (white at 62% / night at 52%), no blur (see Acrylic backdrop and panes).
- **Shadow Strategy:** acrylic edge plus acrylic lift, stacked with a 1px ring at 10% foreground (25% on hover). See Elevation.
- **Internal Padding:** 16px by default, 12px for compact cards.
- **Hover actions** (pin, delete) float in the top-right corner on their own small acrylic popover pane and fade in on hover or focus. On touch screens they are always visible.

### Inputs / Fields
- **Style:** transparent fill (30% Noche Campo in dark), 1px Borde Campo stroke, 8px radius, 32px high.
- **Focus:** Lavanda Hecha border plus a 3px Lavanda Hecha ring at 50%.
- **Error / Disabled:** Rojo Aviso border with a 20% ring; disabled controls drop to 50% opacity.
- **Inline title:** the note title is a borderless 40px input with a 30% placeholder, the only input with no visible chrome.

### Toasts
Bottom-center, acrylic popover panes stacked with an 8px gap, at most two at a time (newest at the bottom) so an error never hides a pending **Deshacer**. Each has its own timer: 5s, or 8s for errors. Errors read "<what failed>. Revisa tu conexión e inténtalo de nuevo." in Rojo Aviso and carry one action: **Reintentar** repeats the exact failed write (for note edits, the latest pending version, never an older one), and **Recargar** reloads when loading data failed. The container is a polite live region; errors are `role="alert"`.

### Keyboard Shortcuts Panel
A keyboard icon button sits left of the theme toggle in the top-right of every page; **?** (outside text fields) toggles it too. It opens a 320px acrylic popover titled *Atajos de teclado* with three small groups (General, Inicio, Editor de notas), each a two-column list of action and `Kbd` keys. `Ctrl + /` is deliberately not used to open it because the code editor uses it to comment lines.

### Navigation
- **Sidebar:** the thinnest acrylic pane (white at 42% / night at 45%) with a translucent right hairline. Nav rows are 14px Lápiz Violeta with 18px Phosphor icons (fill weight on the active row) and 6.4px corners. Hover and active rows fill Velo Lavanda and darken the text, and the active row turns medium weight.
- **Folder tree:** 13px rows with emoji and chevron. The "+" for a new note appears only on row hover. Notes indent 32px under their folder.

### Pinned Mini-Card (signature)
The cockpit instrument: a compact card with a chip label at the top left (which opens the full page) and an unpin icon at the top right, holding a live miniature of a tool: today's tasks, the month, or the running timer in 28px tabular numerals.

### Home Title (signature)
The Home headline plays its phrases once on arrival and then settles; it never loops while the user works. With pins it says a time-of-day greeting (*Buenos días*, *Buenas tardes* or *Buenas noches*) and settles on today's date (*Martes, 17 de noviembre*), so the cockpit always names the day. With nothing pinned the title is just the greeting (no gendered *Bienvenido*). Greeting, date and "today" come from a minute clock (`useClock`), so they roll over at midnight on their own. Component: `src/components/RotatingTitle.tsx`.
- **Day status line:** under the date, one line of body text in Lápiz Violeta built only from real state, joined with " · ": today's tasks (*2 de 5 tareas hechas*, *Tareas de hoy terminadas* or *Sin tareas para hoy*), overdue count (*3 atrasadas*, the one interactive part: an underlined text link to the Tareas page), and the Pomodoro (*Trabajo en marcha, quedan 12 min*, *Descanso en pausa, quedan 4 min* or *2 pomodoros hechos*). Tabular numerals; no color, no icons. It is the cockpit's at-a-glance readout, so it never shows slogans or encouragement. It is its own component reading the Pomodoro context, so the per-second tick redraws this line and the mini Pomodoro only, not the page.
- **Welcome (nothing pinned):** the greeting as the title, one sentence (*Fija aquí lo que usas cada día para tenerlo a mano al abrir SnapNote.*) and a row of four buttons: **Nueva nota** as the one primary button, then outline **Fijar Tareas**, **Fijar Pomodoro** and **Fijar Calendario**, each with its sidebar icon. Pinning from here switches Home straight to the cockpit.
- **Motion:** each phrase holds for 2.4s. The outgoing phrase rises 0.3em and blurs to 8px over 320ms (ease-in); the incoming one enters from 0.4em below and 10px of blur over 700ms with `cubic-bezier(0.16, 1, 0.3, 1)`, 90ms later, in the normal text color. Both stack in one grid cell so nothing below shifts.
- **Behavior:** the first phrase renders without animation; the sequence waits while the tab is hidden so it is never missed.
- **Accessibility:** the heading's accessible name is always the final phrase (the date, or Bienvenido), so sighted and screen-reader users get the same title. Under `prefers-reduced-motion` the final phrase shows directly with no sequence.

### Code Block (signature)
Code in notes and card previews keeps VS Code colors: 13px mono, 6.4px radius, 1px code border and the code background. Code surfaces stay solid, never acrylic, so the token colors read exactly as in VS Code. It clamps to 3 lines on compact cards and 6 lines otherwise.

### Task Checkbox
An 18px, nearly square box (4px) with a 60% Lápiz Violeta border. When checked it fills Lavanda Hecha with a white check, the clearest instance of the Lit-When-Done Rule.

## Do's and Don'ts

### Do:
- **Do** keep Lavanda Hecha (#7a5af8 / #9b7bff) for checked, active, progress and focus states only.
- **Do** use the violet-tinted neutrals (Tinta Violeta #2e2a38, never pure black) and keep every color token defined for both light and dark.
- **Do** design dark first (it's the default theme) and check light as an equal.
- **Do** make anything pinnable usable in its mini-card form on Home, not just as a link to its page.
- **Do** give every icon button a tooltip in Spanish, plus its shortcut when one exists.
- **Do** render code with the `--code-*` tokens and the 20px mono line.
- **Do** use Phosphor icons in the regular weight, switching to `fill` only to mark the active item.
- **Do** keep depth soft and ambient (see the Soft-Lift Rule), and build new surfaces as acrylic panes from the existing `--card`, `--popover` or `--sidebar` tokens plus `.acrylic`.
- **Do** keep the solid fallback values in sync with the translucent ones.

### Don't:
- **Don't** turn SnapNote into a pixel copy of Notion. Keep its calm, but let the cockpit structure, mini-cards and code surfaces carry the identity.
- **Don't** add a second accent color, or gradients and brand color on panes, text or controls. Ambient color belongs only to the backdrop (see the Backdrop-Only Color Rule).
- **Don't** put code on glass, or nest acrylic inside acrylic more than one level deep.
- **Don't** add a second UI font, a display typeface or CDN-loaded fonts. Hierarchy comes from weight and size.
- **Don't** mix icon families. Every icon comes from Phosphor (`@phosphor-icons/react`).
- **Don't** use hard or colored shadows.
- **Don't** let syntax colors leak into UI chrome.
