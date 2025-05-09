-- First create a system user that will be the author of the questions
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-2222-3333-4444-555555555555',
  'authenticated',
  'authenticated',
  'system@imperio.com',
  '$2a$10$Q7RNHL1pIJNJ5JxqhRNtZOZGZKdeJXZxXlnHPO.QoqYrFKGJ4n1S6', -- dummy hashed password
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin"}',
  NOW(),
  NOW()
);

-- Then insert the questions using the system user's ID
INSERT INTO public.questions (id, statement, discipline, topic, difficulty, type, explanation, author_id, approved, source, year, board)
VALUES
  -- Constitutional Law
  ('11111111-1111-1111-1111-111111111111', 
   'De acordo com a Constituição Federal, a soberania é um:',
   'Direito Constitucional',
   'Princípios Fundamentais',
   'easy',
   'multiple_choice',
   'A soberania é um dos fundamentos da República Federativa do Brasil, conforme Art. 1º, I, da CF/88.',
   '11111111-2222-3333-4444-555555555555',
   true,
   'Constituição Federal',
   2024,
   'CESPE'),

  ('22222222-2222-2222-2222-222222222222',
   'São direitos sociais previstos na Constituição Federal, EXCETO:',
   'Direito Constitucional',
   'Direitos Sociais',
   'medium',
   'multiple_choice',
   'Os direitos sociais estão previstos no art. 6º da CF/88. O direito à propriedade é um direito individual, previsto no art. 5º.',
   '11111111-2222-3333-4444-555555555555',
   true,
   'Constituição Federal',
   2024,
   'FCC'),

  -- Administrative Law
  ('33333333-3333-3333-3333-333333333333',
   'O princípio da legalidade na Administração Pública significa que:',
   'Direito Administrativo',
   'Princípios Administrativos',
   'medium',
   'multiple_choice',
   'O princípio da legalidade, previsto no art. 37 da CF/88, vincula a Administração Pública a fazer apenas o que a lei permite.',
   '11111111-2222-3333-4444-555555555555',
   true,
   'Lei 8.112/90',
   2024,
   'VUNESP'),

  -- Portuguese
  ('44444444-4444-4444-4444-444444444444',
   'Assinale a alternativa em que todas as palavras estão grafadas corretamente:',
   'Português',
   'Ortografia',
   'easy',
   'multiple_choice',
   'A grafia correta segue as regras do Novo Acordo Ortográfico.',
   '11111111-2222-3333-4444-555555555555',
   true,
   null,
   2024,
   'FGV'),

  -- General Knowledge
  ('55555555-5555-5555-5555-555555555555',
   'O aquecimento global é um fenômeno causado principalmente por:',
   'Conhecimentos Gerais',
   'Meio Ambiente',
   'easy',
   'multiple_choice',
   'O efeito estufa intensificado pela emissão de gases poluentes é a principal causa do aquecimento global.',
   '11111111-2222-3333-4444-555555555555',
   true,
   null,
   2024,
   'CESPE');

-- Insert alternatives
INSERT INTO public.alternatives (id, question_id, text, is_correct, "order")
VALUES
  -- Alternatives for Constitutional Law Question 1
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Objetivo fundamental da República', false, 1),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Fundamento da República', true, 2),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Princípio que rege as relações internacionais', false, 3),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Direito social garantido aos cidadãos', false, 4),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Direito político individual', false, 5),

  -- Alternatives for Constitutional Law Question 2
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Educação', false, 1),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Saúde', false, 2),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Trabalho', false, 3),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Propriedade', true, 4),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Moradia', false, 5),

  -- Alternatives for Administrative Law Question
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'A Administração pode fazer tudo que não é proibido por lei', false, 1),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'A Administração só pode fazer o que a lei permite', true, 2),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'A Administração pode fazer tudo que julgar conveniente', false, 3),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'A lei não se aplica aos atos administrativos discricionários', false, 4),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'A Administração pode ignorar a lei em casos excepcionais', false, 5),

  -- Alternatives for Portuguese Question
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 'exceção, excessão, contenção', false, 1),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 'exceção, excesso, contensão', false, 2),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 'exceção, excesso, contenção', true, 3),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 'excessão, excesso, contenção', false, 4),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 'exceção, excesso, contensão', false, 5),

  -- Alternatives for General Knowledge Question
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 'Diminuição da camada de ozônio', false, 1),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 'Emissão de gases de efeito estufa', true, 2),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 'Chuva ácida', false, 3),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 'Poluição sonora', false, 4),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 'Desmatamento direto', false, 5);