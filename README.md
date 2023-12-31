## Description

This is a tech test, part of an interview process at a company I cannot disclosure.

To understand the requirements of the tech, go to INSTRUCTIONS.md.>

## Installation

### Requirements
- Postgres database (use docker for it)
- Clone the `.env.example` file and rename it to `.env`.

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Private%20Pension%20API&uri=https%3A%2F%2Fgist.github.com%2Fjonathangaldino%2F3804f1a0117f693961b6b771b60c90d6)

### Dependencies
```bash
$ pnpm install
```

## Running the app


```bash
# copy env variables
# make sure to modify the postgres connection to the right one
$ cp .env.example .env


# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

# copy env variables
# make sure to modify the postgres connection to the right one
$ cp .env.example .env.testing

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```

Controller tests were made using Supertest, so the request is 'actually' made.
That's why we don't have any e2e tests, but we have integration ones.

## Swagger documentation

Go to `http://localhost:3000/api`

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
