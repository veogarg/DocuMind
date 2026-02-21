-- Enhanced retrieval with document metadata for reranking/cross-document synthesis
create or replace function match_chunks_v2 (
  query_embedding vector(3072),
  match_count int,
  user_id uuid
)
returns table (
  id uuid,
  file_name text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    document_chunks.id,
    document_chunks.file_name,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  where document_chunks.user_id = match_chunks_v2.user_id
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
$$;

-- Cost/performance observability events
create table if not exists ai_observability_events (
  id uuid primary key default gen_random_uuid(),
  request_id text not null,
  route text not null,
  user_id uuid,
  event_type text not null,
  total_ms int,
  stage_metrics jsonb,
  token_usage jsonb,
  metadata jsonb,
  created_at timestamp default now()
);

create index if not exists idx_ai_observability_events_user_id
  on ai_observability_events(user_id);
create index if not exists idx_ai_observability_events_created_at
  on ai_observability_events(created_at desc);

-- Automated evaluation reports
create table if not exists rag_evaluations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  summary jsonb not null,
  case_results jsonb not null,
  created_at timestamp default now()
);

alter table ai_observability_events enable row level security;
alter table rag_evaluations enable row level security;

drop policy if exists "Users read their observability events" on ai_observability_events;
create policy "Users read their observability events"
on ai_observability_events
for select
using (auth.uid() = user_id);

drop policy if exists "Users read their eval runs" on rag_evaluations;
create policy "Users read their eval runs"
on rag_evaluations
for select
using (auth.uid() = user_id);

drop policy if exists "Users insert own eval runs" on rag_evaluations;
create policy "Users insert own eval runs"
on rag_evaluations
for insert
with check (auth.uid() = user_id);
