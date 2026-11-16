alter table public.surveys
  add constraint surveys_description_length
  check (char_length(trim(description)) <= 500);

create or replace function public.create_survey(
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
  if jsonb_array_length(p_questions) > 10 then
    raise exception 'A survey can have at most 10 questions';
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
    if jsonb_array_length(v_question -> 'answers') > 6 then
      raise exception 'Question % can have at most 6 answers', v_position;
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
