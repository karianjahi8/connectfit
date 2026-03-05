import { Link } from 'react-router-dom';
import { ShoppingCart, CheckCircle, Package, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useExchangeRates, convertToLocalCurrency, convertToUSDC, formatLocalCurrency } from '@/hooks/useExchangeRates';
import { useCart } from '@/hooks/useCart';
import { useSelectedCountry } from '@/hooks/useSelectedCountry';
import { getCountryName } from '@/lib/countries';

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price_avax: number | null;
  price_usdc: number | null;
  price_kes: number | null;
  images: string[];
  stock: number;
  vendor: {
    business_name: string;
    onchain_verified: boolean;
    country?: string | null;
  };
}

export function ProductCard({ product }: { product: Product }) {
  const { data: rates } = useExchangeRates();
  const { selectedCountry } = useSelectedCountry();
  const { addToCart } = useCart();

  const baseCurrency = product.price_usdc != null ? 'USDC' : 'AVAX';
  const primaryPrice = product.price_usdc ?? product.price_avax ?? 0;
  const usdcAmount = rates ? convertToUSDC(primaryPrice, baseCurrency, rates) : primaryPrice;
  const localAmount = rates ? convertToLocalCurrency(usdcAmount, 'USDC', selectedCountry, rates) : 0;

  const categoryLabels: Record<string, string> = {
    gym_wear: 'Gym Wear',
    equipment: 'Equipment',
    supplements: 'Supplements',
    accessories: 'Accessories',
  };

  return (
    <Card className="group h-full gradient-card border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden">
      <div className="aspect-square relative overflow-hidden bg-muted">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        <Badge className="absolute top-3 left-3 text-xs" variant="secondary">
          {categoryLabels[product.category] || product.category}
        </Badge>
        {product.stock <= 3 && product.stock > 0 && (
          <Badge className="absolute top-3 right-3 text-xs bg-destructive text-destructive-foreground">
            Only {product.stock} left
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 flex-wrap">
            <span>{product.vendor.business_name}</span>
            {product.vendor.onchain_verified && <CheckCircle className="w-3 h-3 text-success" />}
            {product.vendor.country && (
              <span className="inline-flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {getCountryName(product.vendor.country)}
              </span>
            )}
          </div>
          <Link to={`/marketplace/${product.id}`}>
            <h3 className="font-display font-semibold leading-tight line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="font-display font-bold text-lg">{usdcAmount.toFixed(2)} USDC</span>
            {rates && localAmount > 0 && (
              <p className="text-xs text-muted-foreground">≈ {formatLocalCurrency(localAmount, selectedCountry)}</p>
            )}
          </div>
          <Button
            size="sm"
            variant="hero"
            className="gap-1.5"
            disabled={product.stock === 0}
            onClick={(e) => {
              e.preventDefault();
              addToCart.mutate({ productId: product.id });
            }}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {product.stock === 0 ? 'Sold Out' : 'Add'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
