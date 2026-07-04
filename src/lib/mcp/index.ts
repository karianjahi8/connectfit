import { defineMcp } from "@lovable.dev/mcp-js";
import searchProducts from "./tools/search-products";
import listVendors from "./tools/list-vendors";
import platformInfo from "./tools/platform-info";

export default defineMcp({
  name: "fitconnect-mcp",
  title: "FitConnect MCP",
  version: "0.1.0",
  instructions:
    "Tools for FitConnect, a global fitness marketplace. Use `platform_info` for an overview, `search_products` to browse marketplace items (wears, equipment, supplements), and `list_vendors` to find verified vendors by country/city.",
  tools: [platformInfo, searchProducts, listVendors],
});
