import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export default defineTool({
  name: "list_vendors",
  title: "List FitConnect vendors",
  description:
    "List verified fitness vendors on FitConnect, optionally filtered by country or city.",
  inputSchema: {
    country: z.string().trim().optional(),
    city: z.string().trim().optional(),
    limit: z.number().int().min(1).max(50).default(20),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ country, city, limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    let q = supabase
      .from("vendors_public")
      .select("id,business_name,description,city,country,logo_url,onchain_verified,status")
      .limit(limit);
    if (country) q = q.ilike("country", country);
    if (city) q = q.ilike("city", city);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { vendors: data ?? [] },
    };
  },
});
