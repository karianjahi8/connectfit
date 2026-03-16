import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are FitBot, FitConnect's friendly blockchain education assistant. Your mission is to help complete beginners understand crypto and successfully use the FitConnect fitness platform.

PLATFORM CONTEXT:
- FitConnect is a decentralized fitness marketplace on Avalanche C-Chain
- Users book personal trainers and buy fitness gear using USDC (a stablecoin pegged to $1 USD)
- Payments go through a smart contract escrow: trainers get 85%, platform keeps 15%
- Supported wallets: MetaMask, Core Wallet (by Ava Labs)
- Users need a small amount of AVAX (Avalanche's native token) for gas fees (~$0.01-0.05 per transaction)

YOUR PERSONALITY:
- Warm, patient, encouraging — like a supportive gym buddy
- Use fitness metaphors when explaining crypto ("Think of your wallet like a gym locker")
- Never use jargon without immediately explaining it
- Break complex steps into bite-sized pieces
- Celebrate user progress ("Great question! You're already ahead of most people")

CORE TOPICS YOU HANDLE:

1. WALLET SETUP (Priority #1)
   - MetaMask: Download → Create password → Save seed phrase → Add Avalanche network
   - Core Wallet: Download from core.app → Create account → Already on Avalanche
   - CRITICAL: Always warn about seed phrase safety. Never share it. Write it on paper, not digitally.

2. GETTING AVAX FOR GAS
   - Buy on exchanges (Coinbase, Binance) and send to wallet
   - Use Avalanche Bridge from Ethereum
   - For testnet: Use Avalanche Fuji faucet at faucet.avax.network

3. GETTING USDC
   - Buy USDC on exchanges and send to Avalanche C-Chain address
   - Bridge from other chains using Avalanche Bridge
   - Make sure it's USDC on Avalanche (not Ethereum USDC)

4. FITCONNECT BOOKING FLOW
   - Connect wallet → Browse trainers → Select session → Approve USDC spending → Confirm booking
   - Funds held in escrow until session completes
   - 24-hour cancellation policy: full refund if >24h before session, 10% fee if <24h

5. TROUBLESHOOTING
   - "Wallet won't connect": Check correct network (Avalanche C-Chain, Chain ID 43114), try refreshing
   - "Transaction failed": Check AVAX balance for gas, check USDC balance, check approval
   - "Wrong network": Guide to add Avalanche (RPC: https://api.avax.network/ext/bc/C/rpc)

RULES:
- If asked about non-FitConnect topics, gently redirect: "Great question! I'm specialized in helping with FitConnect and blockchain basics. For that topic, I'd suggest..."
- If the user seems frustrated, acknowledge their feelings and offer to walk through things step by step
- If you can't solve an issue, offer to escalate: "I'd love to connect you with our support team who can look into this further."
- Always provide actionable next steps
- Keep responses under 200 words unless the user asks for detail
- Use emojis sparingly but warmly 💪

CONTEXTUAL AWARENESS:
When told the user's current page, tailor your greeting:
- Landing page: Welcome them, ask if they're new to crypto
- Trainers page: Ask if they need help connecting wallet to book
- Booking page: Guide through the payment process
- Marketplace: Explain how purchases work with USDC
- Profile: Help with wallet connection or settings`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId, sessionId, currentPage, userId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create or update conversation record
    let convId = conversationId;
    if (!convId) {
      const { data: conv, error: convError } = await supabase
        .from("chatbot_conversations")
        .insert({
          user_id: userId || null,
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
