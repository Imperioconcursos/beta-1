/*
  # Add new questions and alternatives
  
  1. New Content
    - Adds 10 new questions across different subjects
    - Each question includes alternatives, metadata, and explanations
  
  2. Changes
    - Uses DO blocks to prevent duplicate key violations
    - Safely inserts questions and alternatives
    - Maintains data integrity with foreign key relationships
*/

DO $$
DECLARE
  question_exists boolean;
BEGIN
  -- Check if questions already exist
  SELECT EXISTS (
    SELECT 1 FROM public.questions 
    WHERE id = 'caf4cd83-105d-4e4c-a8fa-1c9ca0c8daed'
  ) INTO question_exists;

  -- Only proceed with inserts if questions don't exist
  IF NOT question_exists THEN
    -- Insert new questions
    INSERT INTO public.questions (id, statement, discipline, topic, difficulty, type, explanation, author_id, approved, source, year, board)
    VALUES
      -- Constitutional Law - Legislative Power
      ('caf4cd83-105d-4e4c-a8fa-1c9ca0c8daed',
       'De acordo com a Constituição Federal, qual é o papel do Poder Legislativo?',
       'Direito Constitucional',
       'Poderes da União',
       'medium',
       'multiple_choice',
       'O Poder Legislativo tem como função primordial elaborar leis e fiscalizar o Poder Executivo, conforme art. 44 e seguintes da CF/88.',
       '11111111-2222-3333-4444-555555555555',
       true,
       'Constituição Federal',
       2024,
       'CESPE'),

      -- Portuguese Language
      ('bcefb060-c484-4d85-917c-cfafa9497a34',
       'Assinale a alternativa em que todas as palavras estão acentuadas corretamente.',
       'Português',
       'Ortografia',
       'easy',
       'multiple_choice',
       'As regras de acentuação seguem o Novo Acordo Ortográfico.',
       '11111111-2222-3333-4444-555555555555',
       true,
       null,
       2024,
       'FCC'),

      -- Administrative Law
      ('b5f55dbd-2de8-48a6-867c-8699efd27e5e',
       'O princípio da legalidade na Administração Pública significa:',
       'Direito Administrativo',
       'Princípios Administrativos',
       'medium',
       'multiple_choice',
       'O princípio da legalidade está previsto no art. 37 da CF/88 e vincula a Administração Pública ao que a lei determina.',
       '11111111-2222-3333-4444-555555555555',
       true,
       'Lei 8.112/90',
       2024,
       'VUNESP'),

      -- Constitutional Law - Social Rights
      ('eb046206-ffbe-4a7e-870a-8d3a1d61b712',
       'Qual das opções representa um direito social segundo a Constituição?',
       'Direito Constitucional',
       'Direitos Sociais',
       'easy',
       'multiple_choice',
       'Os direitos sociais estão previstos no art. 6º da CF/88.',
       '11111111-2222-3333-4444-555555555555',
       true,
       'Constituição Federal',
       2024,
       'FGV'),

      -- General Knowledge
      ('628435e2-faaf-45ba-8c5c-d4e6c3a1acb1',
       'Qual é a principal fonte de energia renovável utilizada no Brasil?',
       'Conhecimentos Gerais',
       'Meio Ambiente',
       'easy',
       'multiple_choice',
       'A energia hidrelétrica é a principal fonte de energia renovável no Brasil, representando cerca de 65% da matriz energética.',
       '11111111-2222-3333-4444-555555555555',
       true,
       null,
       2024,
       'CESPE'),

      -- History
      ('c126b6f3-10e0-4986-a41a-b29a8035337b',
       'Em qual década ocorreu a Proclamação da República no Brasil?',
       'História',
       'Brasil República',
       'easy',
       'multiple_choice',
       'A Proclamação da República ocorreu em 15 de novembro de 1889.',
       '11111111-2222-3333-4444-555555555555',
       true,
       null,
       2024,
       'FCC'),

      -- Portuguese - Verbs
      ('c770d085-a006-461b-8441-2b02794bf145',
       'Qual é a forma correta de conjugação do verbo ''intervir'' na 1ª pessoa do singular do presente do indicativo?',
       'Português',
       'Verbos',
       'medium',
       'multiple_choice',
       'O verbo ''intervir'' segue a conjugação do verbo ''vir'', seu primitivo.',
       '11111111-2222-3333-4444-555555555555',
       true,
       null,
       2024,
       'FGV'),

      -- IT
      ('8c614783-d1bd-4bc5-a9ff-c2388ea49726',
       'No contexto de redes de computadores, o que significa a sigla ''IP''?',
       'Informática',
       'Redes',
       'easy',
       'multiple_choice',
       'IP significa Internet Protocol, protocolo responsável pelo endereçamento e entrega de pacotes na internet.',
       '11111111-2222-3333-4444-555555555555',
       true,
       null,
       2024,
       'CESPE'),

      -- Public Administration
      ('b0e6cb42-db9b-4f8a-88e5-e864f2014692',
       'Qual é o conceito de orçamento público?',
       'Administração Pública',
       'Orçamento',
       'medium',
       'multiple_choice',
       'O orçamento público é um instrumento de planejamento e execução das finanças públicas.',
       '11111111-2222-3333-4444-555555555555',
       true,
       'Lei 4.320/64',
       2024,
       'VUNESP'),

      -- Administrative Law - Administrative Acts
      ('e6a0ea88-e2fb-4261-aac4-8a17369df759',
       'O que significa a expressão ''ato discricionário'' na Administração Pública?',
       'Direito Administrativo',
       'Atos Administrativos',
       'medium',
       'multiple_choice',
       'Ato discricionário é aquele em que a Administração pode escolher a melhor forma de agir, dentro dos limites da lei.',
       '11111111-2222-3333-4444-555555555555',
       true,
       null,
       2024,
       'CESPE');

    -- Insert alternatives for the new questions
    INSERT INTO public.alternatives (id, question_id, text, is_correct, "order")
    VALUES
      -- Constitutional Law - Legislative Power
      (gen_random_uuid(), 'caf4cd83-105d-4e4c-a8fa-1c9ca0c8daed', 'Elaborar leis e fiscalizar o Poder Executivo', true, 1),
      (gen_random_uuid(), 'caf4cd83-105d-4e4c-a8fa-1c9ca0c8daed', 'Executar as leis e administrar o país', false, 2),
      (gen_random_uuid(), 'caf4cd83-105d-4e4c-a8fa-1c9ca0c8daed', 'Julgar conflitos entre cidadãos', false, 3),
      (gen_random_uuid(), 'caf4cd83-105d-4e4c-a8fa-1c9ca0c8daed', 'Defender os interesses do Estado em juízo', false, 4),
      (gen_random_uuid(), 'caf4cd83-105d-4e4c-a8fa-1c9ca0c8daed', 'Representar o país em relações internacionais', false, 5),

      -- Portuguese - Accentuation
      (gen_random_uuid(), 'bcefb060-c484-4d85-917c-cfafa9497a34', 'júri, táxi, cônsul', true, 1),
      (gen_random_uuid(), 'bcefb060-c484-4d85-917c-cfafa9497a34', 'juri, táxi, consul', false, 2),
      (gen_random_uuid(), 'bcefb060-c484-4d85-917c-cfafa9497a34', 'júri, taxi, cônsul', false, 3),
      (gen_random_uuid(), 'bcefb060-c484-4d85-917c-cfafa9497a34', 'juri, taxi, consul', false, 4),
      (gen_random_uuid(), 'bcefb060-c484-4d85-917c-cfafa9497a34', 'júri, táxi, consul', false, 5),

      -- Administrative Law - Legality
      (gen_random_uuid(), 'b5f55dbd-2de8-48a6-867c-8699efd27e5e', 'A Administração só pode fazer o que a lei permite', true, 1),
      (gen_random_uuid(), 'b5f55dbd-2de8-48a6-867c-8699efd27e5e', 'A Administração pode fazer tudo que não é proibido', false, 2),
      (gen_random_uuid(), 'b5f55dbd-2de8-48a6-867c-8699efd27e5e', 'A lei não se aplica aos atos administrativos', false, 3),
      (gen_random_uuid(), 'b5f55dbd-2de8-48a6-867c-8699efd27e5e', 'A Administração pode ignorar a lei em casos especiais', false, 4),
      (gen_random_uuid(), 'b5f55dbd-2de8-48a6-867c-8699efd27e5e', 'As leis são apenas sugestões para a Administração', false, 5),

      -- Constitutional Law - Social Rights
      (gen_random_uuid(), 'eb046206-ffbe-4a7e-870a-8d3a1d61b712', 'Educação', true, 1),
      (gen_random_uuid(), 'eb046206-ffbe-4a7e-870a-8d3a1d61b712', 'Propriedade', false, 2),
      (gen_random_uuid(), 'eb046206-ffbe-4a7e-870a-8d3a1d61b712', 'Liberdade de expressão', false, 3),
      (gen_random_uuid(), 'eb046206-ffbe-4a7e-870a-8d3a1d61b712', 'Direito de votar', false, 4),
      (gen_random_uuid(), 'eb046206-ffbe-4a7e-870a-8d3a1d61b712', 'Direito à vida', false, 5),

      -- General Knowledge - Renewable Energy
      (gen_random_uuid(), '628435e2-faaf-45ba-8c5c-d4e6c3a1acb1', 'Hidrelétrica', true, 1),
      (gen_random_uuid(), '628435e2-faaf-45ba-8c5c-d4e6c3a1acb1', 'Solar', false, 2),
      (gen_random_uuid(), '628435e2-faaf-45ba-8c5c-d4e6c3a1acb1', 'Eólica', false, 3),
      (gen_random_uuid(), '628435e2-faaf-45ba-8c5c-d4e6c3a1acb1', 'Biomassa', false, 4),
      (gen_random_uuid(), '628435e2-faaf-45ba-8c5c-d4e6c3a1acb1', 'Geotérmica', false, 5),

      -- History - Republic Proclamation
      (gen_random_uuid(), 'c126b6f3-10e0-4986-a41a-b29a8035337b', '1880', true, 1),
      (gen_random_uuid(), 'c126b6f3-10e0-4986-a41a-b29a8035337b', '1870', false, 2),
      (gen_random_uuid(), 'c126b6f3-10e0-4986-a41a-b29a8035337b', '1890', false, 3),
      (gen_random_uuid(), 'c126b6f3-10e0-4986-a41a-b29a8035337b', '1900', false, 4),
      (gen_random_uuid(), 'c126b6f3-10e0-4986-a41a-b29a8035337b', '1860', false, 5),

      -- Portuguese - Verb Conjugation
      (gen_random_uuid(), 'c770d085-a006-461b-8441-2b02794bf145', 'Intervenho', true, 1),
      (gen_random_uuid(), 'c770d085-a006-461b-8441-2b02794bf145', 'Intervim', false, 2),
      (gen_random_uuid(), 'c770d085-a006-461b-8441-2b02794bf145', 'Intervengo', false, 3),
      (gen_random_uuid(), 'c770d085-a006-461b-8441-2b02794bf145', 'Intervejo', false, 4),
      (gen_random_uuid(), 'c770d085-a006-461b-8441-2b02794bf145', 'Intervinho', false, 5),

      -- IT - IP Definition
      (gen_random_uuid(), '8c614783-d1bd-4bc5-a9ff-c2388ea49726', 'Internet Protocol', true, 1),
      (gen_random_uuid(), '8c614783-d1bd-4bc5-a9ff-c2388ea49726', 'Internet Provider', false, 2),
      (gen_random_uuid(), '8c614783-d1bd-4bc5-a9ff-c2388ea49726', 'Internet Port', false, 3),
      (gen_random_uuid(), '8c614783-d1bd-4bc5-a9ff-c2388ea49726', 'Internet Program', false, 4),
      (gen_random_uuid(), '8c614783-d1bd-4bc5-a9ff-c2388ea49726', 'Internet Process', false, 5),

      -- Public Administration - Budget
      (gen_random_uuid(), 'b0e6cb42-db9b-4f8a-88e5-e864f2014692', 'Instrumento de planejamento e execução das finanças públicas', true, 1),
      (gen_random_uuid(), 'b0e6cb42-db9b-4f8a-88e5-e864f2014692', 'Lista de despesas do governo', false, 2),
      (gen_random_uuid(), 'b0e6cb42-db9b-4f8a-88e5-e864f2014692', 'Conjunto de impostos a serem cobrados', false, 3),
      (gen_random_uuid(), 'b0e6cb42-db9b-4f8a-88e5-e864f2014692', 'Relatório de gastos realizados', false, 4),
      (gen_random_uuid(), 'b0e6cb42-db9b-4f8a-88e5-e864f2014692', 'Previsão de arrecadação de tributos', false, 5),

      -- Administrative Law - Discretionary Act
      (gen_random_uuid(), 'e6a0ea88-e2fb-4261-aac4-8a17369df759', 'Ato em que a Administração pode escolher a melhor forma de agir, dentro dos limites da lei', true, 1),
      (gen_random_uuid(), 'e6a0ea88-e2fb-4261-aac4-8a17369df759', 'Ato que não precisa seguir a lei', false, 2),
      (gen_random_uuid(), 'e6a0ea88-e2fb-4261-aac4-8a17369df759', 'Ato que depende de autorização judicial', false, 3),
      (gen_random_uuid(), 'e6a0ea88-e2fb-4261-aac4-8a17369df759', 'Ato que não pode ser revogado', false, 4),
      (gen_random_uuid(), 'e6a0ea88-e2fb-4261-aac4-8a17369df759', 'Ato que dispensa motivação', false, 5);
  END IF;
END $$;