import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are FitBot, FitConnect's friendly fitness platform assistant. Your mission is to help users navigate FitConnect and understand how payments work in under 10 minutes.

CORE KNOWLEDGE:

1. GETTING STARTED
- Users sign up with email, Google, Apple, or phone number
- No crypto knowledge needed — the platform handles everything automatically
- A secure payment account is created automatically when you sign up
- You can also connect an existing wallet (MetaMask, Core Wallet) if you're an advanced user

2. PAYMENTS
- FitConnect uses USDC (a digital dollar) — 1 USDC = $1 USD, always stable
- Prices are shown in dollars with local currency equivalents
- You can add funds with a debit or credit card directly in the app
- Funds are held securely until services are confirmed
- You book a trainer → money is held safely → session happens → you confirm → trainer gets paid (85%), platform keeps 15%
- Trainer no-show → cancel → automatic refund
- 24h+ before session: full refund. <24h: 10% cancellation fee

3. SECURITY
- Your account is protected by your login method (email, Google, etc.)
- Advanced users who connect their own wallet should keep their recovery phrase private
- FitConnect will NEVER ask for passwords or recovery phrases
- All payments are transparent and verifiable

4. PLATFORM FEATURES
- Browse trainers, clubs, and fitness merchants by country
- View prices in your local currency
- Book sessions (in-person or virtual)
- Shop fitness gear, equipment, and supplements
- Install the app on your phone for easy access

TROUBLESHOOTING:

"Can't sign in":
1. Check your email/phone for a verification link
2. Try a different sign-in method (Google, Apple, email)
3. Clear browser cache and try again

"Payment failed":
1. Check your balance — you may need to add funds
2. Try adding funds with a different card
3. Contact support if the issue persists

"How do I add funds?":
Click the "Add funds" button when making a payment, or go to your profile to top up with a debit/credit card.

TONE & STYLE:
- Friendly teacher, NOT crypto bro
- Use everyday analogies: digital dollar, bank account, debit card
- NO blockchain jargon unless the user specifically asks
- Emojis sparingly: ✅💰🔒💪 for emphasis
- Keep answers under 200 words
- Always end with clear next action
- If unsure → offer to connect with support team

CONTEXTUAL AWARENESS:
When told the user's current page, tailor responses:
- "/" (Landing): Welcome, explain what FitConnect does
- "/trainers": Help finding and booking trainers
- "/bookings": Guide through booking management
- "/marketplace": Explain how to browse and buy products
- "/profile": Help with account settings`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const MessageSchema = z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(5000),
    });

    const BodySchema = z.object({
      messages: z.array(MessageSchema).min(1).max(50),
      conversationId: z.string().uuid().optional().nullable(),
      sessionId: z.string().max(200).optional().nullable(),
      currentPage: z.string().max(200).optional().default("/"),
    });

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, conversationId: inputConvId, sessionId, currentPage } = parsed.data;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create or update conversation record
    let convId = inputConvId;
    if (!convId) {
      const { data: conv, error: convError } = await supabase
        .from("chatbot_conversations")
        .insert({
          user_id: null,
          session_id: sessionId || crypto.randomUUID(),
          current_page: currentPage || "/",
        })
        .select("id")
        .single();

      if (convError) {
        console.error("Conversation create error:", convError);
      } else {
        convId = conv.id;
      }
    }

    // Store user message
    if (convId && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "user") {
        await supabase.from("chatbot_messages").insert({
          conversation_id: convId,
          role: "user",
          content: lastMsg.content,
        });

        await supabase
          .from("chatbot_conversations")
          .update({ message_count: messages.length, current_page: currentPage })
          .eq("id", convId);
      }
    }

    // Build context-aware system prompt
    let contextPrompt = SYSTEM_PROMPT;
    if (currentPage) {
      contextPrompt += `\n\nThe user is currently on the "${currentPage}" page of FitConnect.`;
    }

    // Check for escalation keywords
    const lastUserMsg = messages.filter((m: any) => m.role === "user").pop();
    const escalationKeywords = ["human", "support", "agent", "talk to someone", "real person", "help me please"];
    const needsEscalation = lastUserMsg && escalationKeywords.some((k: string) => 
      lastUserMsg.content.toLowerCase().includes(k)
    );

    if (needsEscalation && convId) {
      await supabase
        .from("chatbot_conversations")
        .update({ escalated: true })
        .eq("id", convId);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: contextPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "I'm getting a lot of questions right now! Please try again in a moment. 💪" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Return streaming response with conversation ID header
    const headers = new Headers(corsHeaders);
    headers.set("Content-Type", "text/event-stream");
    if (convId) {
      headers.set("X-Conversation-Id", convId);
    }

    return new Response(response.body, { headers });
  } catch (e) {
    console.error("chatbot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
