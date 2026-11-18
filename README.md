# PollApp

Create surveys, vote on them and watch the results change live. Built with Angular and
Supabase.

## Features

- Surveys ending soon are highlighted above the list, earliest first
- Active and past surveys in separate tabs, filterable by category
- New surveys are created in a dialog with up to 10 questions and 2–6 answers each, single
  or multiple choice, optional description and end date
- Results update live for every visitor while others vote
- Past surveys stay readable but closed for voting
- One vote per survey and browser (localStorage)
- Responsive from 320 px; respects reduced-motion settings

## Tech Stack

- **Angular 22** with standalone components, signals and typed reactive forms
- **Supabase**: PostgreSQL with Row Level Security, Realtime and a nightly `pg_cron` job
- **SCSS** with BEM class names
- **pnpm**, Prettier

## Getting Started

Requires Node.js 22 and pnpm.

```bash
git clone https://github.com/Payitahtlabs/poll-app.git
cd poll-app
pnpm install
pnpm start
```

| Script       | Description                                  |
| ------------ | -------------------------------------------- |
| `pnpm start` | Dev server at `http://localhost:4200/`       |
| `pnpm build` | Production build to `dist/poll-app/browser/` |

## Project Structure

```
supabase/
├── migrations/        tables, functions, access rules, realtime, nightly reset
└── seed.sql           demo surveys
src/
├── styles/            shared styles (buttons, form fields)
└── app/
    ├── models/        shape of the data
    ├── services/      loading, live updates, dialog and message state
    ├── pages/         home, survey detail
    ├── components/    building blocks of the pages
    ├── pipes/         date and letter formatting
    └── utils/         pure helper functions
```

## Notes

- **Demo data** is restored every night at 04:00 (Berlin) so deadlines stay relative to
  today. Surveys created by visitors are removed at that point.
- **Votes and new surveys** are written only through two database functions that check every
  input; direct writes are refused.
- **Reduced motion:** with this system setting, moving effects are switched off. An animation
  that does not seem to play is most likely this setting.

## Background

Project from the Developer Akademie frontend curriculum, written to the DA coding conventions.

The visual design belongs to Developer Akademie and is used here for training purposes only.
The source code is published for review but not released under an open-source license.
