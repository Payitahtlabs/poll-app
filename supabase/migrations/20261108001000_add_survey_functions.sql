create function public.create_survey(
  p_title text,
  p_category text,
  p_description text,
  p_end_date date,
  p_questions jsonb
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_survey_id bigint;
  v_question_id bigint;
  v_question jsonb;
  v_position bigint;
begin
  if jsonb_typeof(p_questions) is distinct from 'array'
    or jsonb_array_length(p_questions) < 1 then
    raise exception 'A survey needs at least one question';
  end if;
  if p_end_date < (now() at time zone 'Europe/Berlin')::date then
    raise exception 'The end date must not be in the past';
  end if;

  insert into public.surveys (title, category, description, end_date)
  values (trim(p_title), p_category, nullif(trim(p_description), ''), p_end_date)
  returning id into v_survey_id;

  for v_question, v_position in
    select value, ordinality from jsonb_array_elements(p_questions) with ordinality
  loop
    if jsonb_typeof(v_question -> 'answers') is distinct from 'array'
      or jsonb_array_length(v_question -> 'answers') < 2 then
      raise exception 'Question % needs at least two answers', v_position;
    end if;

    insert into public.questions (survey_id, position, text, allow_multiple)
    values (
      v_survey_id, v_position, trim(v_question ->> 'text'),
      coalesce((v_question ->> 'allowMultiple')::boolean, false)
    )
    returning id into v_question_id;

    insert into public.answer_options (question_id, position, text)
    select v_question_id, ordinality, trim(value #>> '{}')
    from jsonb_array_elements(v_question -> 'answers') with ordinality;
  end loop;

  return v_survey_id;
end;
$$;

create function public.submit_votes(p_option_ids bigint[])
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_survey_id bigint;
  v_survey_count bigint;
  v_end_date date;
begin
  if coalesce(cardinality(p_option_ids), 0) = 0 then
    raise exception 'Select at least one answer';
  end if;
  if (select count(distinct id) from unnest(p_option_ids) as id) <> cardinality(p_option_ids)
    or (select count(*) from public.answer_options where id = any(p_option_ids))
      <> cardinality(p_option_ids) then
    raise exception 'The selection contains unknown or duplicate answers';
  end if;

  select count(distinct q.survey_id), min(q.survey_id)
  into v_survey_count, v_survey_id
  from public.answer_options a
  join public.questions q on q.id = a.question_id
  where a.id = any(p_option_ids);
  if v_survey_count <> 1 then
    raise exception 'All answers must belong to the same survey';
  end if;

  select end_date into v_end_date from public.surveys where id = v_survey_id;
  if v_end_date < (now() at time zone 'Europe/Berlin')::date then
    raise exception 'This survey has ended';
  end if;

  if exists (
    select 1
    from public.answer_options a
    join public.questions q on q.id = a.question_id
    where a.id = any(p_option_ids) and not q.allow_multiple
    group by q.id
    having count(*) > 1
  ) then
    raise exception 'A single-choice question allows only one answer';
  end if;

  if exists (
    select 1 from public.questions q
    where q.survey_id = v_survey_id
      and not exists (
        select 1 from public.answer_options a
        where a.question_id = q.id and a.id = any(p_option_ids)
      )
  ) then
    raise exception 'Please answer every question';
  end if;

  update public.answer_options set votes = votes + 1 where id = any(p_option_ids);
end;
$$;
