/*
  # Initial schema setup for Império Concursos

  1. New Tables
    - questions
      - id (uuid, primary key)
      - statement (text)
      - discipline (text)
      - topic (text)
      - difficulty (text)
      - type (text)
      - explanation (text)
      - author_id (uuid, references auth.users)
      - created_at (timestamptz)
      - approved (boolean)
      - source (text)
      - year (integer)
      - board (text)

    - alternatives
      - id (uuid, primary key)
      - question_id (uuid, references questions)
      - text (text)
      - is_correct (boolean)
      - order (integer)

    - simulations
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - disciplines (text[])
      - question_count (integer)
      - time_limit (integer)
      - difficulty (text)
      - author_id (uuid, references auth.users)
      - created_at (timestamptz)
      - is_public (boolean)

    - simulation_questions
      - simulation_id (uuid, references simulations)
      - question_id (uuid, references questions)
      - order (integer)
      - primary key (simulation_id, question_id)

    - simulation_results
      - id (uuid, primary key)
      - simulation_id (uuid, references simulations)
      - user_id (uuid, references auth.users)
      - started_at (timestamptz)
      - finished_at (timestamptz)
      - score (integer)
      - time_taken (integer)
      - correct_answers (integer)

    - user_answers
      - id (uuid, primary key)
      - result_id (uuid, references simulation_results)
      - question_id (uuid, references questions)
      - selected_alternative_id (uuid, references alternatives)
      - is_correct (boolean)
      - time_taken (integer)
      - created_at (timestamptz)

    - achievements
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - icon (text)
      - points (integer)
      - requirement_type (text)
      - requirement_value (integer)
      - created_at (timestamptz)

    - user_achievements
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - achievement_id (uuid, references achievements)
      - unlocked_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Questions table
CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  statement text NOT NULL,
  discipline text NOT NULL,
  topic text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  type text NOT NULL CHECK (type IN ('multiple_choice', 'true_false', 'essay')),
  explanation text,
  author_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  approved boolean DEFAULT false,
  source text,
  year integer,
  board text
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Alternatives table
CREATE TABLE public.alternatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES public.questions ON DELETE CASCADE NOT NULL,
  text text NOT NULL,
  is_correct boolean NOT NULL,
  "order" integer NOT NULL,
  UNIQUE (question_id, "order")
);

ALTER TABLE public.alternatives ENABLE ROW LEVEL SECURITY;

-- Simulations table
CREATE TABLE public.simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  disciplines text[] NOT NULL,
  question_count integer NOT NULL,
  time_limit integer NOT NULL, -- in minutes
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'mixed')),
  author_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_public boolean DEFAULT false
);

ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

-- Simulation Questions table
CREATE TABLE public.simulation_questions (
  simulation_id uuid REFERENCES public.simulations ON DELETE CASCADE,
  question_id uuid REFERENCES public.questions ON DELETE CASCADE,
  "order" integer NOT NULL,
  PRIMARY KEY (simulation_id, question_id)
);

ALTER TABLE public.simulation_questions ENABLE ROW LEVEL SECURITY;

-- Simulation Results table
CREATE TABLE public.simulation_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_id uuid REFERENCES public.simulations ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz,
  score integer,
  time_taken integer, -- in seconds
  correct_answers integer DEFAULT 0
);

ALTER TABLE public.simulation_results ENABLE ROW LEVEL SECURITY;

-- User Answers table
CREATE TABLE public.user_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  result_id uuid REFERENCES public.simulation_results ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES public.questions NOT NULL,
  selected_alternative_id uuid REFERENCES public.alternatives,
  is_correct boolean,
  time_taken integer, -- in seconds
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

-- Achievements table
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  points integer NOT NULL,
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- User Achievements table
CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  achievement_id uuid REFERENCES public.achievements ON DELETE CASCADE NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Questions policies
CREATE POLICY "Questions are viewable by everyone"
  ON public.questions
  FOR SELECT
  USING (approved = true OR auth.uid() = author_id);

CREATE POLICY "Questions can be inserted by authenticated users"
  ON public.questions
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Questions can be updated by authors and admins"
  ON public.questions
  FOR UPDATE
  USING (auth.uid() = author_id OR EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'
  ));

-- Alternatives policies
CREATE POLICY "Alternatives are viewable by everyone"
  ON public.alternatives
  FOR SELECT
  USING (true);

CREATE POLICY "Alternatives can be managed by question authors"
  ON public.alternatives
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.questions
      WHERE id = alternatives.question_id
      AND author_id = auth.uid()
    )
  );

-- Simulations policies
CREATE POLICY "Public simulations are viewable by everyone"
  ON public.simulations
  FOR SELECT
  USING (is_public = true OR auth.uid() = author_id);

CREATE POLICY "Simulations can be inserted by authenticated users"
  ON public.simulations
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Simulations can be updated by authors"
  ON public.simulations
  FOR UPDATE
  USING (auth.uid() = author_id);

-- Simulation Questions policies
CREATE POLICY "Simulation questions are viewable with simulation access"
  ON public.simulation_questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.simulations
      WHERE id = simulation_questions.simulation_id
      AND (is_public = true OR author_id = auth.uid())
    )
  );

-- Simulation Results policies
CREATE POLICY "Users can view their own results"
  ON public.simulation_results
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own results"
  ON public.simulation_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own results"
  ON public.simulation_results
  FOR UPDATE
  USING (auth.uid() = user_id);

-- User Answers policies
CREATE POLICY "Users can view their own answers"
  ON public.user_answers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.simulation_results
      WHERE id = user_answers.result_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own answers"
  ON public.user_answers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.simulation_results
      WHERE id = user_answers.result_id
      AND user_id = auth.uid()
    )
  );

-- Achievements policies
CREATE POLICY "Achievements are viewable by everyone"
  ON public.achievements
  FOR SELECT
  USING (true);

-- User Achievements policies
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert user achievements"
  ON public.user_achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert some initial achievements
INSERT INTO public.achievements (title, description, icon, points, requirement_type, requirement_value) VALUES
  ('Iniciante', 'Complete seu primeiro simulado', 'award', 50, 'simulations_completed', 1),
  ('Dedicado', 'Complete 10 simulados', 'award', 100, 'simulations_completed', 10),
  ('Mestre', 'Alcance 90% de acertos em um simulado', 'trophy', 200, 'simulation_score', 90),
  ('Maratonista', 'Complete 50 simulados', 'running', 500, 'simulations_completed', 50),
  ('Especialista', 'Acerte 1000 questões', 'target', 300, 'questions_correct', 1000),
  ('Estudioso', 'Estude por 100 horas', 'clock', 400, 'study_hours', 100);