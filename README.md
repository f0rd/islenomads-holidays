# islenomads-holidays

A Maldives travel and tourism dashboard built with React, Vite, Drizzle ORM, and tRPC.

## Setup

1. Install dependencies:

```bash
corepack pnpm install
```

2. Create a local environment file from the example:

```bash
cp .env.example .env
```

3. Set any required environment variables in `.env`.

## Available scripts

- `corepack pnpm exec tsx watch server/_core/index.ts` - run in development
- `corepack pnpm exec vite build` - build the frontend
- `corepack pnpm exec tsc --noEmit` - type check
- `corepack pnpm exec vitest run` - run tests
- `corepack pnpm exec prettier --write .` - format source files

## Environment variables

The application reads the following variables from the environment:

- `DATABASE_URL` - MySQL connection string for server/database operations
- `BUILT_IN_FORGE_API_URL` - optional notification service base URL
- `BUILT_IN_FORGE_API_KEY` - optional notification service API key
- `JWT_SECRET` - cookie signing secret
- `OAUTH_SERVER_URL` - OAuth server URL
- `VITE_APP_ID` - frontend app ID
- `OWNER_OPEN_ID` - owner OpenID for admin operations

## Notes

- Contact form submissions now succeed when the notification service is not configured.
- Many server tests require a configured database and `DATABASE_URL` to be available.
