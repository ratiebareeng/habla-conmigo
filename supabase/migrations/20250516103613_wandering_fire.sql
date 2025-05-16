/*
  # Spanish Conversation Database Schema

  1. New Tables
    - `conversation_topics`
      - Stores predefined conversation topics and their metadata
    - `conversation_responses`
      - Stores AI responses with context and difficulty levels
    - `user_conversations`
      - Tracks user conversation history and progress
    - `vocabulary`
      - Stores Spanish vocabulary with translations and usage examples
    - `grammar_rules`
      - Stores Spanish grammar rules and explanations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Topics table
CREATE TABLE conversation_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  difficulty_level text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Responses table
CREATE TABLE conversation_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES conversation_topics(id),
  text text NOT NULL,
  context text NOT NULL,
  difficulty_level text NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- User conversations table
CREATE TABLE user_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  topic_id uuid REFERENCES conversation_topics(id),
  user_message text NOT NULL,
  ai_response text NOT NULL,
  difficulty_level text NOT NULL,
  accuracy_score float DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Vocabulary table
CREATE TABLE vocabulary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spanish_word text NOT NULL,
  english_translation text NOT NULL,
  part_of_speech text NOT NULL,
  difficulty_level text NOT NULL,
  example_sentences text[] DEFAULT '{}',
  usage_notes text,
  created_at timestamptz DEFAULT now()
);

-- Grammar rules table
CREATE TABLE grammar_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  explanation text NOT NULL,
  examples text[] DEFAULT '{}',
  difficulty_level text NOT NULL,
  related_topics text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE conversation_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access to topics"
  ON conversation_topics
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to responses"
  ON conversation_responses
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can read their own conversations"
  ON user_conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
  ON user_conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow public read access to vocabulary"
  ON vocabulary
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to grammar rules"
  ON grammar_rules
  FOR SELECT
  TO public
  USING (true);