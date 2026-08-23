# Solid Realm Platform

A media marketplace for audio and video content, where creators publish and sell their work directly.

## Stack

- **Frontend** — Next.js, TypeScript, Tailwind CSS, axios, react-hook-form
- **Backend** — NestJS, TypeORM, PostgreSQL
- **Storage** — Cloudflare R2 (S3-compatible), direct browser uploads via presigned URLs
- **Auth** — JWT with Passport
- **Monorepo** — Turborepo

## Architecture

The backend follows a layered architecture: controllers handle HTTP, services hold business logic, repositories access the database. Entities define the schema, DTOs define and validate the API contract.

Assets store common fields as columns (type, status, price, genre) and format-specific technical specifications in a JSONB column, keeping the schema flexible across media types without sparse tables.

File uploads never pass through the backend: the client requests a short-lived presigned URL, uploads the file straight to R2, then creates the asset with the returned file key.

## Getting started

Install dependencies:

```bash
npm install
```

Create `apps/backend/.env`:

```
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
PORT=
NODE_ENV=development
JWT_SECRET=
JWT_EXPIRES_IN=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

In development, `synchronize: true` is active — migrations run automatically. Run migrations manually for staging or production:

```bash
npm run migration:run --workspace=backend
```

Run both apps:

```bash
npm run dev
```

## API

| Method | Endpoint              | Auth | Description                                   |
| ------ | --------------------- | ---- | --------------------------------------------- |
| POST   | `/auth/register`      | —    | Create an account                             |
| POST   | `/auth/login`         | —    | Get an access token                           |
| GET    | `/auth/me`            | ✓    | Current user                                  |
| GET    | `/assets`             | —    | Public catalog, paginated, filter by `?type=` |
| GET    | `/assets/mine`        | ✓    | Current user's assets (all statuses)          |
| GET    | `/assets/:id`         | —    | Single asset                                  |
| POST   | `/assets`             | ✓    | Create an asset                               |
| POST   | `/assets/upload-url`  | ✓    | Get a presigned upload URL                    |
| POST   | `/assets/:id/publish` | ✓    | Publish an owned asset                        |
| PATCH  | `/assets/:id`         | ✓    | Update an owned asset                         |
| DELETE | `/assets/:id`         | ✓    | Delete an owned asset                         |
