# PollApp

Umfrage-App mit Angular, Projekt bei der Developer Akademie.
Kein Login. Umfragen, Fragen und Stimmen liegen in Supabase,
Ergebnisse aktualisieren sich live.

## Befehle
- pnpm start   Dev-Server, öffnet den Browser
- pnpm build   Production-Build nach dist/poll-app/browser/

## Techstack
- Angular 22 (Standalone, zoneless), TypeScript, SCSS
- Supabase mit Realtime
- pnpm; neue Pakete nur nach Rücksprache

## Struktur
- Components je Feature unter src/app/, Services unter src/app/shared/services/,
  Interfaces unter src/app/models/
- Assets in public/assets/
- Supabase-Zugang in src/environments/ (nur publishable key)

## Prinzipien
- Templates zeigen fertige Werte; Entscheidungen trifft die Klasse
- Abgeleiteter Zustand ist computed(), nie ein zweites Feld
- Geteilter Zustand lebt im Service
- Die Datenbank ist die einzige Quelle; Änderungen kommen per Realtime-Abo
- Animationen mit CSS, Reduced Motion wird respektiert

## Code
- Konventionen der Developer Akademie (TypeScript und HTML)
- Prettier vor jedem Commit
- Commits auf Englisch, eine Idee pro Commit

## Lizenz
UNLICENSED. Design und Assets stammen von der Developer Akademie.
