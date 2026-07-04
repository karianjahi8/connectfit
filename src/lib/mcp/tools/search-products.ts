import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export default defineTool({
  name: "search_products",
  title: "Search marketplace products",
  description:
    "Search FitConnect marketplace products (wears, equipment, supplements). Returns name, category, price in USDC, stock, and vendor id.",
  inputSchema: {
    query: z.string().trim().optional().describe("Optional text to match in product name/description."),
    category: z
      .enum(["wears", "equipment", "supplements", "apparel", "accessories"])
      .optional()
      .describe("Optional product category filter."),
    limit: z.number().int().min(1).max(50).default(20),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, category, limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    let q = supabase
      .from("products")
      .select("id,name,description,category,price_usdc,price_kes,stock,vendor_id,images,is_active")
      .eq("is_active", true)
      .limit(limit);
    if (category) q = q.eq("category", category as never);
    if (query) q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { products: data ?? [] },
    };
  },
});
