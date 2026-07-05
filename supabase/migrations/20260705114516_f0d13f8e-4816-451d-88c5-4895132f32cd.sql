
-- 1) Scope anonymous chatbot_conversations UPDATE to caller's own session
DROP POLICY IF EXISTS "Anonymous can update own conversation" ON public.chatbot_conversations;
CREATE POLICY "Anonymous can update own conversation"
ON public.chatbot_conversations
FOR UPDATE
TO anon
USING (
  user_id IS NULL
  AND session_id IS NOT NULL
  AND session_id = nullif(current_setting('request.headers', true), '')::json->>'x-session-id'
)
WITH CHECK (
  user_id IS NULL
  AND session_id IS NOT NULL
  AND session_id = nullif(current_setting('request.headers', true), '')::json->>'x-session-id'
);

-- 2) Scope anonymous chatbot_messages INSERT to caller's own session
DROP POLICY IF EXISTS "Anonymous messages allowed insert" ON public.chatbot_messages;
CREATE POLICY "Anonymous messages allowed insert"
ON public.chatbot_messages
FOR INSERT
TO anon
WITH CHECK (
  conversation_id IN (
    SELECT id FROM public.chatbot_conversations
    WHERE user_id IS NULL
      AND session_id IS NOT NULL
      AND session_id = nullif(current_setting('request.headers', true), '')::json->>'x-session-id'
  )
);

-- 3) Privy is the auth provider, so auth.uid() is always NULL for client requests.
--    Revoke direct Data API access for the `authenticated` role on tables that
--    are only meant to be reached through service-role edge functions. This
--    removes the misleading appearance that auth.uid()-scoped policies protect
--    these tables for direct client queries.
REVOKE ALL ON public.activities        FROM authenticated;
REVOKE ALL ON public.cart_items        FROM authenticated;
REVOKE ALL ON public.gym_checkins      FROM authenticated;
REVOKE ALL ON public.order_items       FROM authenticated;
REVOKE ALL ON public.orders            FROM authenticated;
REVOKE ALL ON public.profiles          FROM authenticated;
REVOKE ALL ON public.streak_stats      FROM authenticated;
REVOKE ALL ON public.vendors           FROM authenticated;
REVOKE ALL ON public.chatbot_conversations FROM authenticated;
REVOKE ALL ON public.chatbot_messages  FROM authenticated;
REVOKE ALL ON public.products          FROM authenticated;

-- Service role always retains full access (it bypasses RLS anyway, but make
-- grants explicit for clarity).
GRANT ALL ON public.activities, public.cart_items, public.gym_checkins,
             public.order_items, public.orders, public.profiles,
             public.streak_stats, public.vendors, public.chatbot_conversations,
             public.chatbot_messages, public.products
   TO service_role;
