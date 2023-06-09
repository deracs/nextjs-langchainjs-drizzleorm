SQL

match posts - from [Supabase](https://supabase.com/blog/openai-embeddings-postgres-vector#indexing)

<!-- Add url hyperlink -->

OpenAI recommends cosine similarity on their embeddings, so we will use that here.

Now we can call match\_{table_name}(), pass in our embedding, similarity threshold, and match count, and we'll get a list of all products that match. And since this is all managed by Postgres, our application code becomes very simple.

```sql
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
```

## Indexing

Once your table starts to grow with embeddings, you will likely want to add an index to speed up queries. Vector indexes are particularly important when you're ordering results because vectors are not grouped by similarity, so finding the closest by sequential scan is a resource-intensive operation.

Each distance operator requires a different type of index. We expect to order by cosine distance, so we need vector_cosine_ops index. A good starting number of lists is 4 \* sqrt(table_rows):

```sql
create index on posts using ivfflat (embedding vector_cosine_ops)
with
  (lists = 100);
```

Keyword search

```sql
create function kw_match_products(query_text text, match_count int)
returns table (id bigint, manufacturer text, "name" text, category text, description text,  similarity real)
as $$

begin
return query execute
format('select id, description, category, manufacturer, "name", ts_rank(to_tsvector(description), plainto_tsquery($1)) as similarity
from product
where to_tsvector(description) @@ plainto_tsquery($1)
order by similarity desc
limit $2')
using query_text, match_count;
end;
$$ language plpgsql;
```
