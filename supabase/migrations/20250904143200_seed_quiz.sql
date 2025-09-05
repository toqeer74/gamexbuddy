-- Seed a simple quiz for demo
insert into public.quizzes (slug, title)
select 'gta6-basics', 'GTA 6 Basics'
where not exists (select 1 from public.quizzes where slug = 'gta6-basics');

-- Link questions to quiz
do $$
declare qid uuid;
begin
  select id into qid from public.quizzes where slug='gta6-basics' limit 1;
  if qid is null then return; end if;

  -- Question 1
  if not exists (select 1 from public.quiz_questions where quiz_id=qid and ordinal=1) then
    insert into public.quiz_questions(quiz_id, body, ordinal) values (qid, 'What does GTA stand for?', 1);
    insert into public.quiz_choices(question_id, body, is_correct)
      select id, 'Grand Theft Auto', true from public.quiz_questions where quiz_id=qid and ordinal=1;
    insert into public.quiz_choices(question_id, body, is_correct)
      select id, 'Great Train Adventure', false from public.quiz_questions where quiz_id=qid and ordinal=1;
  end if;

  -- Question 2
  if not exists (select 1 from public.quiz_questions where quiz_id=qid and ordinal=2) then
    insert into public.quiz_questions(quiz_id, body, ordinal) values (qid, 'GTA 6 release window?', 2);
    insert into public.quiz_choices(question_id, body, is_correct)
      select id, '2026', true from public.quiz_questions where quiz_id=qid and ordinal=2;
    insert into public.quiz_choices(question_id, body, is_correct)
      select id, '2019', false from public.quiz_questions where quiz_id=qid and ordinal=2;
  end if;
end $$;

