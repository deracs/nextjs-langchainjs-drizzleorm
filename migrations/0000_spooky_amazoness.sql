DO $$ BEGIN
 CREATE TYPE "priority" AS ENUM('low', 'medium', 'high');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('in_progress', 'done', 'canceled', 'todo', 'backlog');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT * FROM pg_extension WHERE extname = 'vector') THEN
    CREATE EXTENSION vector;
  END IF;
END $$;


CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"manufacturer" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"embedding" vector(1536)
);

CREATE TABLE IF NOT EXISTS "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"status" status DEFAULT 'todo' NOT NULL,
	"priority" priority DEFAULT 'low' NOT NULL,
	"favourite" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" role DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);


-- functions
CREATE OR REPLACE FUNCTION public.match_products(query_embedding vector, match_threshold double precision, match_count integer)
 RETURNS TABLE(id bigint, manufacturer text, "name" text, category text, description text, similarity double precision)
 LANGUAGE sql
 STABLE
AS $function$
  select
    product.id,
    product.manufacturer,
    product."name",
    product.category,
    product.description,
    1 - (product.embedding <=> query_embedding) as similarity
  from product
  where 1 - (product.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$function$

-- indexes
create index on product using ivfflat (embedding vector_cosine_ops)
with
  (lists = 100);