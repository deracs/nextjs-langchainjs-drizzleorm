# Next.js x LangChain x DrizzleORM example/starter

App built using NextJS, Shadcn UI, DrizzleORM with PgVector and LangchainJS

#BuildInPublic

## Usage

`yarn install` to install dependencies.

`yarn migrate` to migrate the database.

`yarn dev` to start the development server.

## Notes:

You should enable pgvector extension. There is a docker image you can use to play around with it locally:

```sql
DO $$ BEGIN
  IF NOT EXISTS (SELECT * FROM pg_extension WHERE extname = 'vector') THEN
    CREATE EXTENSION vector;
  END IF;
END $$;
```

Docker:

`docker-compose build && docker-composer -d up`

## Goals

- Build a AI CRUD app with Langchain
- Embedding/Hybrid Search/QA

## Features

- Next.js 13 App Directory
- LangChainJS
- DrizzleORM
- PgVector
- Shadcn
- Radix UI Primitives
- Tailwind CSS

## TODO

- [ ] Hybrid Search with Drizzle/PgVector/Langchain
- [ ] Re-add Streaming
- [ ] Add tests
- [ ] Better migration tool
