truncate public.surveys restart identity cascade;

do $$
declare
  v_today date := (now() at time zone 'Europe/Berlin')::date;
  v_id bigint;
begin
  v_id := public.create_survey(
    'Let’s Plan the Next Team Event Together',
    'Team Activities',
    'We want to create team activities that everyone will enjoy – share your preferences and ideas in our survey to help us plan better experiences together.',
    v_today + 3,
    '[
      { "text": "Which date would work best for you?", "allowMultiple": true,
        "answers": ["11.12.2026, Friday", "18.12.2026, Friday", "19.12.2026, Saturday", "08.01.2027, Friday"] },
      { "text": "Choose the activities you prefer", "allowMultiple": true,
        "answers": ["Outdoor adventure like kayaking", "Office Costume Party", "Bowling, mini-golf, volleyball", "Beach party, Music & cocktails", "Escape room"] },
      { "text": "What’s most important to you in a team event?", "allowMultiple": false,
        "answers": ["Team bonding", "Food and drinks", "Trying something new", "Keeping it low-key and stress-free"] },
      { "text": "How long would you prefer the event to last?", "allowMultiple": false,
        "answers": ["Half a day", "Full day", "Evening only"] }
    ]'
  );
  update public.surveys set created_at = now() - interval '6 days' where id = v_id;
  update public.answer_options a set votes = (array[3, 5, 2, 4])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 1;
  update public.answer_options a set votes = (array[21, 0, 5, 9, 0])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 2;
  update public.answer_options a set votes = (array[15, 1, 9, 9])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 3;
  update public.answer_options a set votes = (array[1, 6, 0])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 4;
  v_id := public.create_survey(
    'Fit & wellness survey!',
    'Health & Wellness',
    'Help us understand how you stay active and what would make healthy habits easier during the workday.',
    v_today + 6,
    '[
      { "text": "How many days a week are you physically active?", "allowMultiple": false,
        "answers": ["0–1 days", "2–3 days", "4–5 days", "6–7 days"] },
      { "text": "Which activities do you enjoy most?", "allowMultiple": true,
        "answers": ["Running or walking", "Gym or strength training", "Yoga or stretching", "Team sports", "Cycling"] },
      { "text": "What would help you stay healthy at work?", "allowMultiple": true,
        "answers": ["Healthy snacks in the office", "Standing desks", "Short movement breaks", "Shared lunch walks"] }
    ]'
  );
  update public.surveys set created_at = now() - interval '3 days' where id = v_id;
  update public.answer_options a set votes = (array[2, 7, 5, 3])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 1;
  update public.answer_options a set votes = (array[8, 6, 4, 3, 5])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 2;
  update public.answer_options a set votes = (array[6, 4, 9, 3])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 3;
  v_id := public.create_survey(
    'Gaming habits and favorite games!',
    'Gaming & Entertainment',
    'Tell us how and what you like to play so we can plan our next gaming night.',
    v_today + 10,
    '[
      { "text": "How often do you play games?", "allowMultiple": false,
        "answers": ["Every day", "A few times a week", "Now and then", "Hardly ever"] },
      { "text": "Which platforms do you use?", "allowMultiple": true,
        "answers": ["PC", "Console", "Mobile", "Board games"] },
      { "text": "Which genre do you enjoy most?", "allowMultiple": false,
        "answers": ["Strategy", "Shooter", "Puzzle", "Sports", "Role-playing"] }
    ]'
  );
  update public.surveys set created_at = now() - interval '8 days' where id = v_id;
  update public.answer_options a set votes = (array[6, 9, 7, 2])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 1;
  update public.answer_options a set votes = (array[12, 8, 10, 5])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 2;
  update public.answer_options a set votes = (array[5, 4, 3, 6, 6])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 3;
  v_id := public.create_survey(
    'How do you like to learn new skills?',
    'Education & Learning',
    'We are planning learning offers for the coming year and want to match them to the way you learn best.',
    null,
    '[
      { "text": "Which learning formats suit you best?", "allowMultiple": true,
        "answers": ["Online courses", "Workshops on site", "Books and articles", "Learning from colleagues"] },
      { "text": "How much time per week could you invest?", "allowMultiple": false,
        "answers": ["Less than one hour", "One to three hours", "More than three hours"] }
    ]'
  );
  update public.surveys set created_at = now() - interval '2 days' where id = v_id;
  update public.answer_options a set votes = (array[9, 5, 4, 7])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 1;
  update public.answer_options a set votes = (array[6, 10, 3])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 2;
  v_id := public.create_survey(
    'Coffee, tea or something else?',
    'Lifestyle & Preferences',
    'Our kitchen gets a refill soon. Help us choose what ends up on the shelves.',
    v_today + 30,
    '[
      { "text": "What do you drink most often at work?", "allowMultiple": false,
        "answers": ["Coffee", "Tea", "Water", "Something else"] },
      { "text": "Which extras should we add?", "allowMultiple": true,
        "answers": ["Oat milk", "Fresh fruit", "Sparkling water", "Hot chocolate"] }
    ]'
  );
  update public.surveys set created_at = now() - interval '1 day' where id = v_id;
  update public.answer_options a set votes = (array[11, 6, 5, 1])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 1;
  update public.answer_options a set votes = (array[8, 9, 6, 4])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 2;
  v_id := public.create_survey(
    'Which tools make your workday easier?',
    'Technology & Innovation',
    'We want to find out which digital tools help you most and where we should invest next.',
    v_today + 45,
    '[
      { "text": "Which tools do you use every day?", "allowMultiple": true,
        "answers": ["Chat", "Video calls", "Shared documents", "Task boards"] },
      { "text": "Where would a new tool help you most?", "allowMultiple": false,
        "answers": ["Planning", "Communication", "Documentation", "Automation"] }
    ]'
  );
  update public.surveys set created_at = now() - interval '12 hours' where id = v_id;
  v_id := public.create_survey(
    'How was our summer barbecue?',
    'Team Activities',
    'Thanks for joining! Your feedback helps us make the next event even better.',
    null,
    '[
      { "text": "How did you like the event overall?", "allowMultiple": false,
        "answers": ["Loved it", "It was good", "It was okay", "Not my thing"] },
      { "text": "What should we keep for next time?", "allowMultiple": true,
        "answers": ["The food", "The location", "The games", "The music"] }
    ]'
  );
  update public.surveys set end_date = v_today - 4, created_at = now() - interval '20 days' where id = v_id;
  update public.answer_options a set votes = (array[12, 8, 3, 1])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 1;
  update public.answer_options a set votes = (array[15, 9, 7, 5])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 2;
  v_id := public.create_survey(
    'Is your home office ready for remote work?',
    'Technology & Innovation',
    'A quick check of your setup at home so we can support you with the right equipment.',
    null,
    '[
      { "text": "How do you rate your internet connection?", "allowMultiple": false,
        "answers": ["Very stable", "Mostly stable", "Often unstable"] },
      { "text": "Which equipment would help you most?", "allowMultiple": true,
        "answers": ["Second monitor", "Headset", "Ergonomic chair", "Webcam"] }
    ]'
  );
  update public.surveys set end_date = v_today - 21, created_at = now() - interval '35 days' where id = v_id;
  update public.answer_options a set votes = (array[10, 7, 2])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 1;
  update public.answer_options a set votes = (array[9, 6, 8, 3])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 2;
  v_id := public.create_survey(
    'Which workshop topics interest you most?',
    'Education & Learning',
    'We collected ideas for this year’s workshops. Vote for the topics you would attend.',
    null,
    '[
      { "text": "Pick the topics you would attend", "allowMultiple": true,
        "answers": ["Public speaking", "Time management", "Design basics", "Data skills"] },
      { "text": "Which time slot works best?", "allowMultiple": false,
        "answers": ["Morning", "Lunch break", "Afternoon"] }
    ]'
  );
  update public.surveys set end_date = v_today - 60, created_at = now() - interval '75 days' where id = v_id;
  update public.answer_options a set votes = (array[7, 11, 5, 8])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 1;
  update public.answer_options a set votes = (array[4, 9, 6])[a.position]
    from public.questions q where q.id = a.question_id and q.survey_id = v_id and q.position = 2;
end;
$$;
