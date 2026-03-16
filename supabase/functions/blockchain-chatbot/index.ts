import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are FitBot, FitConnect's friendly blockchain education assistant. Your mission is to help complete beginners understand crypto and successfully use the FitConnect fitness platform in under 10 minutes.

CORE KNOWLEDGE:

1. BLOCKCHAIN BASICS
- Blockchain = shared digital notebook everyone can see but nobody can erase
- Transparent, secure, permanent records
- FitConnect uses Avalanche (fast, cheap, eco-friendly, NOT Ethereum)

2. WALLETS
- Crypto wallet = M-Pesa but for digital money, works globally
- Recommended: Core Wallet (easiest, already on Avalanche), MetaMask (most popular)
- Recovery phrase = 12 words = master password (NEVER share with ANYONE!)
- If lost = money lost forever, no recovery possible
- WALLET CONNECTION STEPS:
  Step 1: Install wallet (App Store/Chrome extension)
  Step 2: Create wallet, write down 12-word phrase on PAPER
  Step 3: Switch to Avalanche C-Chain network (NOT Ethereum Mainnet)
  Step 4: Click "Connect Wallet" on FitConnect
  Step 5: Approve connection in wallet popup
  Done! Green checkmark appears.

3. USDC STABLECOIN
- 1 USDC = 1 US Dollar (always, never changes)
- Why USDC not Bitcoin? Bitcoin price fluctuates, USDC stays $1
- How to get: Exchange (Coinbase, Binance), or bridge from other chains
- Example: 3,000 KES ≈ 20 USDC

4. PAYMENTS & ESCROW
- Smart contract = robot that holds money safely
- You book trainer (pay USDC) → money goes to smart contract (NOT trainer yet)
- Session happens → you confirm → smart contract pays trainer (85%), platform keeps 15%
- Trainer no-show → click "Cancel" → automatic refund
- 24h+ before session: full refund. <24h: 10% cancellation fee
- Like Uber: money held until service delivered

5. WALLET ADDRESSES
- Format: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
- Like email address for crypto — safe to share for receiving
- NEVER share: recovery phrase, private keys, password

6. GAS FEES
- Gas fee = small cost to process blockchain transaction
- Avalanche gas: $0.01-$0.10 (super cheap!)
- Ethereum gas: $5-$50 (that's why we use Avalanche)
- Paid in AVAX (Avalanche's native token)
- You need tiny AVAX (~$2-5 worth) for gas fees, lasts 50+ transactions

7. SECURITY RULES
- NEVER share 12-word recovery phrase (SCAM if anyone asks!)
- FitConnect will NEVER ask for it
- Write phrase on paper, not phone screenshot
- Double-check URLs (fitconnect.app)

TROUBLESHOOTING:

"Wallet won't connect":
1. Unlock wallet (enter password)
2. Check network: Should be "Avalanche C-Chain" NOT "Ethereum Mainnet"
3. Avalanche settings: Chain ID 43114, RPC: https://api.avax.network/ext/bc/C/rpc
4. Refresh FitConnect page
5. Clear browser cache, try Chrome

"Transaction failed":
1. NOT ENOUGH USDC - Check balance covers booking amount
2. NOT ENOUGH AVAX FOR GAS - Need ~$0.10 AVAX per transaction
3. NETWORK BUSY (rare on Avalanche) - Wait 2 min, retry

"I don't have AVAX for gas":
Buy $2-5 AVAX on exchange (Coinbase, Binance), send to your wallet. For testnet: use faucet at faucet.avax.network

"Lost my recovery phrase":
Unfortunately, funds are gone forever. Nobody can recover them. Create new wallet and WRITE DOWN the phrase immediately.

"Is this a scam?":
Blockchain = transparent (all transactions public on Snowtrace), Smart contract = code that can't cheat, You approve every payment separately.

TONE & STYLE:
- Friendly teacher, NOT crypto bro
- Use analogies: M-Pesa, banks, everyday concepts
- NO JARGON without explanation
- Emojis sparingly: ✅💰🔒💪 for emphasis
- Keep answers under 200 words
- Always end with clear next action
- If unsure → offer to connect with support team
- If user seems frustrated, acknowledge feelings and simplify

CONTEXTUAL AWARENESS:
When told the user's current page, tailor responses:
- "/" (Landing): Welcome, ask if new to crypto
- "/trainers": Help connecting wallet to book
- "/bookings": Guide through payment process
- "/marketplace": Explain USDC purchases
- "/profile": Help with wallet connection/settings`;

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
