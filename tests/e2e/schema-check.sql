-- Read-only listing of the TEST database's structure, in the same format as
-- tests/e2e/expected-schema.txt. Runs only against the temporary test Supabase.
select line from (
  select 'bucket|'||id||'|public='||public||'|limit='||coalesce(file_size_limit::text,'none')||'|types='||
         coalesce((select string_agg(t, ',' order by t) from unnest(allowed_mime_types) t),'any') as line
    from storage.buckets
  union all
  select 'constraint|'||conrelid::regclass::text||'|'||conname||'|'||pg_get_constraintdef(oid)
    from pg_constraint where connamespace = 'public'::regnamespace and contype in ('c','f','u')
  union all
  select 'function|'||p.oid::regprocedure::text||'|security_definer='||p.prosecdef||
         '|anon='||has_function_privilege('anon', p.oid, 'execute')||
         '|authenticated='||has_function_privilege('authenticated', p.oid, 'execute')
    from pg_proc p where p.pronamespace = 'public'::regnamespace
  union all
  select 'policy|'||schemaname||'.'||tablename||'|'||policyname||'|'||cmd||'|'||roles::text
    from pg_policies where schemaname in ('public','storage')
  union all
  select 'rls|'||relname||'|'||relrowsecurity
    from pg_class where relnamespace = 'public'::regnamespace and relkind = 'r'
) s order by line;
