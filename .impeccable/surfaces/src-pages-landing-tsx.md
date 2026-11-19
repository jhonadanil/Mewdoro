---
version: 1
slug: "src-pages-landing-tsx"
primary_target: "src/pages/Landing.tsx"
related_targets: ["src/pages/Login.tsx"]
---

# Landing (logged-out home) and login

Mode: Persuade (landing) with an Operate form (login). Visitors: students and developers who have not seen Mewdoro. Action: create an account (primary), or sign in (secondary). Proof: the product itself, running with clearly labeled example data; no invented users, metrics or testimonials. Constraints: Spanish copy; Catppuccin Mocha/Latte, pill controls, flat bordered cards (DESIGN.md); no router (hash routes #entrar, #registro); must not pull Firestore or the Workspace into the landing; offline-safe fonts.

## Direction contract

THESIS: The page is the product, not a picture of it: the first viewport is Inicio itself running with example data. It refuses the category default of a headline over subcopy plus a row of equal icon cards, and a screenshot in a device frame.

OWN-WORLD: Mewdoro's established world, unchanged: Mocha/Latte neutrals, Mauve only on done/active and the single primary button, 21.6px flat 1px-bordered cards, pill controls, system sans, the real mini-card, day-check and code-editor components. Recognizable with all copy removed by the cockpit grid of tasks, routines and timer.

STORY: A student or dev understands in one look that a whole study day (tasks, focus, routines, code notes) fits on one screen, tries it by checking a task, ticking a routine and starting the timer with no account, then creates one.

FIRST VIEWPORT: Slim top bar (logo, theme toggle, Entrar ghost, Crear cuenta primary). Left-aligned headline "Tu día entero, en una sola pantalla." and one sentence, with primary "Crear cuenta" and secondary "Ya tengo cuenta". Below, at the same width as the app's Home grid: live Tareas flash card (spans two columns), Pomodoro and Rutinas cards with a quiet "Demo con datos de ejemplo" label. The primary action sits above the grid, left aligned.

FORM: Position 1 of 7 on my ordered list ("La cabina en vivo"), chosen by the user; seed:7c96a987cce0ad84. Below the grid: a live editable code note (the real CodeEditor) and a week-tracker fragment, each beside a short paragraph, then a closing call to action.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

Login: visible labels, show/hide password, back link to the landing, quiet value column on wide screens.
