import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "platform_info",
  title: "About FitConnect",
  description:
    "Return an overview of FitConnect: what it does, supported categories of trainers/clubs/marketplace, currencies, and booking flow.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify({
          name: "FitConnect",
          summary:
            "Global Web3 fitness marketplace connecting clients with trainers, clubs, and fitness vendors. USDC escrow bookings on Avalanche with local-currency display.",
          trainer_categories: [
            "athletes",
            "football",
            "swimming",
            "golf",
            "gym",
            "yoga",
            "running",
            "boxing",
          ],
          club_categories: ["wellness centres", "golf clubs", "football clubs", "running clubs"],
          marketplace_categories: ["wears", "equipment", "supplements"],
          currencies: { primary: "USDC", chain: "Avalanche" },
          booking_flow:
            "Book trainer → funds held in escrow → session confirmed → 85% to trainer, 15% platform fee.",
        }),
      },
    ],
  }),
});
