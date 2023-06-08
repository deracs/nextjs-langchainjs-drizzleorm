# Next.js x LangChain x DrizzleORM example

Task app built using NextJS, Shadcn UI, DrizzleORM and Langchain JS

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

## Goals

- build a CRUD AI app with Langchain

## Features

- Next.js 13 App Directory
- Radix UI Primitives
- Tailwind CSS
- Icons from [Lucide](https://lucide.dev)
- Dark mode with `next-themes`
- Tailwind CSS class sorting, merging and linting.
- LangChainJS
- DrizzleORM

## TODO

- Re-add Streaming
- Tidy up code
- Add tests
- Better migration tool
