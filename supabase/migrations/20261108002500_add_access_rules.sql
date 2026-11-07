alter table public.surveys enable row level security;
alter table public.questions enable row level security;
alter table public.answer_options enable row level security;

revoke all on table public.surveys, public.questions, public.answer_options
  from anon, authenticated;
grant select on table public.surveys, public.questions, public.answer_options to anon;

create policy "Anyone can read surveys"
  on public.surveys for select to anon using (true);
create policy "Anyone can read questions"
  on public.questions for select to anon using (true);
create policy "Anyone can read answer options"
  on public.answer_options for select to anon using (true);

revoke all on function public.create_survey(text, text, text, date, jsonb)
  from public, anon, authenticated;
revoke all on function public.submit_votes(bigint[])
  from public, anon, authenticated;
grant execute on function public.create_survey(text, text, text, date, jsonb) to anon;
grant execute on function public.submit_votes(bigint[]) to anon;
