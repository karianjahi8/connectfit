import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters';
import { Input } from '@/components/ui/input';
import { Search, ShoppingBag, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { countries } from '@/lib/countries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['marketplace-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, description, category, price_avax, price_usdc, price_kes, images, stock, is_active,
          vendors:vendor_id ( business_name, onchain_verified, status, country )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || [])
        .filter((p: any) => p.vendors?.status === 'verified')
        .map((p: any) => ({ ...p, vendor: p.vendors }));
    },
  });

  const filtered = products.filter((p: any) => {
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const matchesPrice = (p.price_avax ?? 0) <= priceRange[1];
    const matchesVerified = !verifiedOnly || p.vendor?.onchain_verified;
    const matchesCountry = selectedCountry === 'all' || p.vendor?.country === selectedCountry;
    return matchesSearch && matchesCat && matchesPrice && matchesVerified && matchesCountry;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            <ShoppingBag className="inline-block w-8 h-8 mr-2 -mt-1" />
            <span className="gradient-text">Marketplace</span>
          </h1>
          <p className="text-muted-foreground">Gym wear, equipment & supplements from verified vendors worldwide</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12 text-base" />
          </div>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-full sm:w-48 h-12">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="All Countries" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="all">🌍 All Countries</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:w-72 shrink-0">
            <MarketplaceFilters
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              verifiedOnly={verifiedOnly}
              onVerifiedOnlyChange={setVerifiedOnly}
            />
          </motion.aside>

          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">{filtered.length} products found</p>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product: any, i: number) => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}

            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No products found. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
