
-- Chatbot conversations table
CREATE TABLE public.chatbot_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  current_page text,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  escalated boolean DEFAULT false,
  message_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Chatbot messages table
CREATE TABLE public.chatbot_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.chatbot_conversations(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  feedback text CHECK (feedback IN ('helpful', 'not_helpful'))
);

-- Enable RLS
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies - authenticated users can manage their own conversations
CREATE POLICY "Users can view own conversations" ON public.chatbot_conversations
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can create conversations" ON public.chatbot_conversations
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own conversations" ON public.chatbot_conversations
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Anonymous users can also use the chatbot (no user_id)
CREATE POLICY "Anonymous conversations allowed" ON public.chatbot_conversations
  FOR ALL TO anon USING (user_id IS NULL) WITH CHECK (user_id IS NULL);

CREATE POLICY "Users can view own messages" ON public.chatbot_messages
  FOR SELECT TO authenticated
  USING (conversation_id IN (SELECT id FROM public.chatbot_conversations WHERE user_id = auth.uid()));

CREATE POLICY "Users can create messages" ON public.chatbot_messages
  FOR INSERT TO authenticated
  WITH CHECK (conversation_id IN (SELECT id FROM public.chatbot_conversations WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own messages" ON public.chatbot_messages
  FOR UPDATE TO authenticated
  USING (conversation_id IN (SELECT id FROM public.chatbot_conversations WHERE user_id = auth.uid()));

-- Anonymous message policies
CREATE POLICY "Anonymous messages allowed select" ON public.chatbot_messages
  FOR SELECT TO anon
  USING (conversation_id IN (SELECT id FROM public.chatbot_conversations WHERE user_id IS NULL));

CREATE POLICY "Anonymous messages allowed insert" ON public.chatbot_messages
  FOR INSERT TO anon
  WITH CHECK (conversation_id IN (SELECT id FROM public.chatbot_conversations WHERE user_id IS NULL));

-- Index for performance
CREATE INDEX idx_chatbot_conversations_user ON public.chatbot_conversations(user_id);
CREATE INDEX idx_chatbot_messages_conversation ON public.chatbot_messages(conversation_id);
CREATE INDEX idx_chatbot_conversations_session ON public.chatbot_conversations(session_id);
