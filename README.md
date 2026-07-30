# Solid Realm Platform

A media marketplace for audio and video content, where creators publish and sell their work directly.

## Stack

- **Frontend** — Next.js, TypeScript, Tailwind CSS
- **Backend** — NestJS, TypeORM, PostgreSQL
- **Auth** — JWT with Passport
- **Monorepo** — Turborepo

## Architecture

The backend follows a layered architecture: controllers handle HTTP, services hold business logic, repositories access the database. Entities define the schema, DTOs define and validate the API contract.

Assets store common fields as columns (type, status, price, genre) and format-specific technical specifications in a JSONB column, keeping the schema flexible across media types without sparse tables.

## Getting started

Install dependencies:

```bash
npm install
```

Create `apps/backend/.env`:

DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
PORT=
NODE_ENV=

JWT_SECRET=
JWT_EXPIRES_IN=

Run both apps:

```bash
npm run dev
```

## API

## API

| Method | Endpoint              | Auth | Description                                        |
| ------ | --------------------- | ---- | -------------------------------------------------- |
| POST   | `/auth/register`      | —    | Create an account                                  |
| POST   | `/auth/login`         | —    | Get an access token                                |
| GET    | `/auth/me`            | ✓    | Current user                                       |
| GET    | `/assets`             | —    | Public catalog, paginated, filter by `?type=`      |
| GET    | `/assets/:id`         | —    | Single asset                                       |
| POST   | `/assets`             | ✓    | Create an asset                                    |
| POST   | `/assets/:id/publish` | ✓    | Publish an owned asset                             |
| GET    | `/assets/mine`        | ✓    | Current user's assets (all statuses)               |
| GET    | `/assets/:id`         | —    | Single asset (déjà annoncé, maintenant implémenté) |
