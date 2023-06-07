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

CREATE TABLE IF NOT EXISTS "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"embedding" vector(3)
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
