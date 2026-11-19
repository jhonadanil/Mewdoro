# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Students and developers who study or write code and want their notes, code snippets, daily tasks and focus sessions in one place. They come back to it every day: they open Home, check what is due today, start a Pomodoro, and write or look up notes (often code) while they work.

## Product Purpose

Mewdoro is a personal workspace for the daily study or coding routine. It brings together Notion-style notes, a VS Code-style code editor inside notes, daily tasks, a Pomodoro timer and a monthly calendar. It succeeds when a user opens it at the start of a session and runs the whole day from it, without switching between a notes app, an editor, a to-do list and a timer.

## Positioning

Mewdoro is built around the daily ritual, not around documents. Home is a dashboard the user arranges: pinned notes, today's tasks (including overdue ones from earlier days), the calendar and the Pomodoro timer are all on one screen. Notion, VS Code and a separate Pomodoro app each cover one part of the day; Mewdoro covers the whole day for students and developers.

## Operating Context

- Daily loop: open Home, review and check off tasks, run focus and break blocks, take or consult notes.
- Notes are often code (Bash, Python, HTML, CSS, JavaScript, TypeScript, JSON, SQL, Markdown) as well as plain text, organized in emoji folders in a sidebar tree.
- Used with the keyboard a lot: `Ctrl + .` toggles the sidebar, `Ctrl + /` comments code, Tab/Shift+Tab indent, Enter in the title jumps to the body (`⌘` on Mac).
- Signed-in use with data synced to the cloud and working offline.

## Capabilities and Constraints

- Stack in place: React 19 + TypeScript, Vite, Tailwind CSS v4 + shadcn/ui (Radix), Phosphor icons (`@phosphor-icons/react`), Firebase Authentication (email/password and Google) and Cloud Firestore, Prism for highlighting.
- Notes: full-page editor with folder/note path, note type selector, autosave, pin to Home.
- Code editor: VS Code Dark+/Light+ token colors, bracket-pair colorization, auto-closing pairs, smart indentation, comment toggle.
- Tasks: per-day lists with progress and carry-over of pending tasks from earlier days; pinnable to Home.
- Pomodoro: configurable work, short-break and long-break durations, optional sound, auto-start of the next block; pinnable to Home.
- Calendar: monthly view, pinnable to Home.
- Search across note title, content and type.
- Light and dark themes.
- Data model: `users/{uid}` (settings, pins), plus `notes`, `folders` and `tasks` subcollections; Firestore rules restrict each user to their own data.
- Interface language: Spanish (`lang="es"`).
- Open decisions (asked, not answered yet): whether the UI stays Spanish-only, how important mobile use is, whether the shadcn/Tailwind styling stack is locked, and whether there is a formal accessibility target.

## Brand Commitments

- Name: Mewdoro. Logo at `public/favicon.svg`.
- The product openly references Notion (notes feel, light/dark palette) and VS Code (code editor feel). Neither is a binding brand asset.

## Evidence on Hand

- README.md describes features, setup and shortcuts.
- No users, testimonials, metrics or press exist. Future work must not invent them.

## Product Principles

1. **The day is the unit.** Every feature should help with today: what to do, what to focus on, what to write down.
2. **Home is the cockpit.** Things you use every day should be pinnable to Home and usable from there without opening their full page.
3. **Code is a first-class note.** Code notes get real editor behavior, not a styled text box.
4. **Fast and keyboard-friendly.** A student or developer mid-session shouldn't have to wait or reach for the mouse.
5. **One focused tool, not a platform.** Prefer a simple, complete routine over Notion-scale flexibility.
