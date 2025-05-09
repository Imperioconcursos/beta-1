/*
  # Add Criminal Law Questions

  1. New Questions
    - Adds 3 new Criminal Law questions with alternatives
    - Topics covered: Basic Principles, Types of Crime, Criminal Procedure
  
  2. Changes
    - All questions are set as approved and authored by the system user
    - Each question includes detailed explanations
*/

DO $$
BEGIN
  -- Insert Criminal Law questions
  INSERT INTO public.questions (id, statement, discipline, topic, difficulty, type, explanation, author_id, approved, source, year, board)
  VALUES
    -- Basic Principles
    (
      gen_random_uuid(),
      'O princípio da legalidade no Direito Penal está expresso na máxima:',
      'Direito Penal',
      'Princípios Fundamentais',
      'easy',
      'multiple_choice',
      'O princípio da legalidade está previsto no art. 1º do Código Penal e no art. 5º, XXXIX da CF/88, estabelecendo que não há crime sem lei anterior que o defina, nem pena sem prévia cominação legal.',
      '11111111-2222-3333-4444-555555555555',
      true,
      'Código Penal',
      2024,
      'CESPE'
    ),
    
    -- Types of Crime
    (
      gen_random_uuid(),
      'Sobre o crime culposo, é correto afirmar que:',
      'Direito Penal',
      'Teoria do Crime',
      'medium',
      'multiple_choice',
      'O crime culposo ocorre quando o agente dá causa ao resultado por imprudência, negligência ou imperícia, conforme art. 18, II, do Código Penal.',
      '11111111-2222-3333-4444-555555555555',
      true,
      'Código Penal',
      2024,
      'FCC'
    ),
    
    -- Criminal Procedure
    (
      gen_random_uuid(),
      'São condições da ação penal:',
      'Direito Penal',
      'Ação Penal',
      'medium',
      'multiple_choice',
      'As condições da ação penal são requisitos necessários para o regular exercício do direito de ação no processo penal.',
      '11111111-2222-3333-4444-555555555555',
      true,
      'Código de Processo Penal',
      2024,
      'VUNESP'
    );

  -- Insert alternatives for the first question (Principle of Legality)
  INSERT INTO public.alternatives (id, question_id, text, is_correct, "order")
  SELECT
    gen_random_uuid(),
    id,
    unnest(ARRAY[
      'Nullum crimen, nulla poena sine praevia lege',
      'Pacta sunt servanda',
      'In dubio pro societate',
      'Tempus regit actum',
      'Dura lex sed lex'
    ]),
    unnest(ARRAY[true, false, false, false, false]),
    generate_series(1, 5)
  FROM public.questions
  WHERE statement LIKE '%princípio da legalidade no Direito Penal%';

  -- Insert alternatives for the second question (Culpable Crime)
  INSERT INTO public.alternatives (id, question_id, text, is_correct, "order")
  SELECT
    gen_random_uuid(),
    id,
    unnest(ARRAY[
      'Ocorre quando o agente dá causa ao resultado por imprudência, negligência ou imperícia',
      'Sempre depende de previsão legal expressa',
      'É punido com a mesma pena do crime doloso',
      'Não admite tentativa',
      'É a regra no direito penal brasileiro'
    ]),
    unnest(ARRAY[true, false, false, false, false]),
    generate_series(1, 5)
  FROM public.questions
  WHERE statement LIKE '%crime culposo%';

  -- Insert alternatives for the third question (Criminal Action)
  INSERT INTO public.alternatives (id, question_id, text, is_correct, "order")
  SELECT
    gen_random_uuid(),
    id,
    unnest(ARRAY[
      'Legitimidade, interesse de agir e possibilidade jurídica do pedido',
      'Apenas justa causa',
      'Apenas legitimidade e interesse',
      'Competência e jurisdição',
      'Apenas tipicidade e autoria'
    ]),
    unnest(ARRAY[true, false, false, false, false]),
    generate_series(1, 5)
  FROM public.questions
  WHERE statement LIKE '%condições da ação penal%';
END $$;