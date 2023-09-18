## Description

This is a tech test, part of an interview process at a company I cannot disclosure.

To understand the requirements of the tech, go to RULES.md.

## Installation

### Requirements
- Postgres database (use docker for it)
- Clone the `.env.example` file and rename it to `.env`.




### Dependencies
```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Running this API on a container

### Dockerfile

- Exposes the default port: 3000
- Is running the builded files (.js files - the ones that NestJS builds)

### Docker Compose
Useful for local playground of the api. It will spawn:
- the api service
- a postgres database

When you're running the compose for the first time, the api will crash because the database and migrations are not created yet.

For it to work:

On your .env file, you should have `DATABASE_URL` with the following value (example): `DATABASE_URL="postgres://postgres:postgres@postgres:5432/privatepension?schema=public&sslmode=prefer"`.

Run `$ docker compose up` and then, change the `HOST` from the `DATABASE_URL` to `localhost`. E.g:  `DATABASE_URL="postgres://postgres:postgres@localhost:5432/privatepension?schema=public&sslmode=prefer"`

Now, you can create the database and then run the migrations:
`$ pnpm prisma migrate dev`. Later, restart the api service and you should be good to go.

[Documentation](https://notiz.dev/blog/dockerizing-nestjs-with-prisma-and-postgresql)
