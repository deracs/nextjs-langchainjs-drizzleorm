SQL

match posts - from [Supabase](https://supabase.com/blog/openai-embeddings-postgres-vector#indexing)

<!-- Add url hyperlink -->

OpenAI recommends cosine similarity on their embeddings, so we will use that here.

Now we can call match\_{table_name}(), pass in our embedding, similarity threshold, and match count, and we'll get a list of all documents that match. And since this is all managed by Postgres, our application code becomes very simple.

```sql
create or replace function match_posts (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  body text,
  similarity float
)
language sql stable
as $$
  select
    posts.id,
    posts.body,
    1 - (posts.embedding <=> query_embedding) as similarity
  from posts
  where 1 - (posts.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
```

## Indexing

Once your table starts to grow with embeddings, you will likely want to add an index to speed up queries. Vector indexes are particularly important when you're ordering results because vectors are not grouped by similarity, so finding the closest by sequential scan is a resource-intensive operation.

Each distance operator requires a different type of index. We expect to order by cosine distance, so we need vector_cosine_ops index. A good starting number of lists is 4 \* sqrt(table_rows):

```sql
create index on posts using ivfflat (embedding vector_cosine_ops)
with
  (lists = 100);
```
