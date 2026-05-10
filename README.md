# Bhagwatsharanpriy

A nonprofit wisdom-learning platform built with Next.js 15, TypeScript, Tailwind CSS, shadcn-style components, Framer Motion, and Prisma.

## Setup

```bash
npm install
npm run dev
```

Create `.env` from `.env.example` before using Prisma:

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Scripts

- `npm run dev` starts the local app.
- `npm run build` creates a production build.
- `npm run lint` runs Next.js linting.
- `npm run typecheck` validates strict TypeScript.
- `npm run prisma:seed` seeds the Bhagavad Gita study engine after a database is available.

## Architecture

- `app/` contains App Router routes and global layout.
- `components/layout/` holds structural shell components.
- `components/ui/` contains shadcn-style primitives.
- `components/wisdom-tree/` and `components/shloka/` isolate domain UI.
- `lib/db/` contains Prisma access.
- `lib/content/` and `lib/search/` are prepared for curated content and search indexing.
- `actions/` is reserved for server actions.

## Study Routes

- `/books`
- `/books/bhagavad-gita`
- `/books/bhagavad-gita/chapters/1`
- `/books/bhagavad-gita/chapters/2`
- `/books/bhagavad-gita/chapters/2/verses/47`
- `/explore`
- `/concepts`
- `/search?q=karma`
- `/discover`
