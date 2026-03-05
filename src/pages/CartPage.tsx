import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Package } from 'lucide-react';
import { useExchangeRates, convertToLocalCurrency, convertToUSDC, formatLocalCurrency } from '@/hooks/useExchangeRates';
import { useSelectedCountry } from '@/hooks/useSelectedCountry';

export default function CartPage() {
  const { cart, cartCount, isLoading, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const { data: rates } = useExchangeRates();
  const { selectedCountry } = useSelectedCountry();

  const getItemPriceUsdc = (item: (typeof cart)[number]) => {
    if (item.product.price_usdc != null) return item.product.price_usdc;
    if (rates && item.product.price_avax != null) return convertToUSDC(item.product.price_avax, 'AVAX', rates);
    return 0;
  };

  const totalUsdc = cart.reduce((sum, item) => sum + getItemPriceUsdc(item) * item.quantity, 0);
  const totalLocal = rates ? convertToLocalCurrency(totalUsdc, 'USDC', selectedCountry, rates) : 0;

  if (!user) {
    return <Layout><div className="container mx-auto px-4 py-16 text-center"><ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" /><h2 className="font-display text-2xl font-bold mb-2">Sign in to view your cart</h2><Link to="/auth"><Button variant="hero">Sign In</Button></Link></div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-6">Your <span className="gradient-text">Cart</span></h1>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />)}</div>
        ) : cart.length === 0 ? (
          <div className="text-center py-16"><Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" /><p className="text-muted-foreground mb-4">Your cart is empty</p><Link to="/marketplace"><Button variant="hero">Browse Marketplace</Button></Link></div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              {cart.map((item) => (
                <Card key={item.id} className="gradient-card border-border/50">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                      {item.product.images?.[0] ? <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-muted-foreground/30" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold truncate">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.product.vendor.business_name}</p>
                      <p className="font-display font-bold text-sm mt-1">{getItemPriceUsdc(item).toFixed(2)} USDC</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: item.quantity - 1 })}><Minus className="w-3 h-3" /></Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: item.quantity + 1 })}><Plus className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: 0 })}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="gradient-card border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between text-lg font-display font-bold">
                  <span>Total</span>
                  <div className="text-right">
                    <p>{totalUsdc.toFixed(2)} USDC</p>
                    {rates && <p className="text-sm text-muted-foreground font-normal">≈ {formatLocalCurrency(totalLocal, selectedCountry)}</p>}
                  </div>
                </div>
                <Link to="/checkout" className="block"><Button variant="hero" className="w-full" size="lg">Checkout ({cartCount} items)</Button></Link>
                <Button variant="ghost" className="w-full text-destructive" onClick={() => clearCart.mutate()}>Clear Cart</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
