import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Smartphone, Coins, CheckCircle } from 'lucide-react';
import { useExchangeRates, convertToLocalCurrency, convertToUSDC, formatLocalCurrency } from '@/hooks/useExchangeRates';
import { useSelectedCountry } from '@/hooks/useSelectedCountry';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: rates } = useExchangeRates();
  const { selectedCountry } = useSelectedCountry();
  const [paymentMethod, setPaymentMethod] = useState<'avax' | 'usdc' | 'mpesa'>('usdc');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getItemPriceUsdc = (item: (typeof cart)[number]) => {
    if (item.product.price_usdc != null) return item.product.price_usdc;
    if (rates && item.product.price_avax != null) return convertToUSDC(item.product.price_avax, 'AVAX', rates);
    return 0;
  };

  const totalUsdc = cart.reduce((sum, item) => sum + getItemPriceUsdc(item) * item.quantity, 0);
  const totalLocal = rates ? convertToLocalCurrency(totalUsdc, 'USDC', selectedCountry, rates) : 0;

  const handleCheckout = async () => {
    if (!user) return;
    if (!shippingAddress.trim()) {
      toast({ title: 'Shipping address required', variant: 'destructive' });
      return;
    }
    if (paymentMethod === 'mpesa' && !phone.trim()) {
      toast({ title: 'Phone number required for mobile money', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const byVendor: Record<string, typeof cart> = {};
      for (const item of cart) {
        const { data: product } = await supabase.from('products').select('vendor_id').eq('id', item.product_id).single();
        if (!product) continue;
        const vid = product.vendor_id;
        if (!byVendor[vid]) byVendor[vid] = [];
        byVendor[vid].push(item);
      }

      for (const [vendorId, items] of Object.entries(byVendor)) {
        const orderTotal = items.reduce((sum, item) => sum + getItemPriceUsdc(item) * item.quantity, 0);
        const currency = paymentMethod === 'usdc' ? 'USDC' : paymentMethod === 'mpesa' ? 'LOCAL' : 'AVAX';

        const { data: order, error: orderErr } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            vendor_id: vendorId,
            payment_method: paymentMethod,
            total_amount: orderTotal,
            currency,
            phone: paymentMethod === 'mpesa' ? phone : null,
            shipping_address: shippingAddress,
          })
          .select('id')
          .single();

        if (orderErr) throw orderErr;

        const orderItems = items.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: getItemPriceUsdc(item),
          currency: 'USDC',
        }));

        const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
        if (itemsErr) throw itemsErr;
      }

      await clearCart.mutateAsync();
      toast({ title: 'Order placed!', description: 'Your order has been submitted successfully.' });
      navigate('/marketplace');
    } catch (err: any) {
      toast({ title: 'Checkout failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return <Layout><div className="container mx-auto px-4 py-16 text-center"><CheckCircle className="w-16 h-16 text-success mx-auto mb-4" /><h2 className="font-display text-2xl font-bold mb-2">Nothing to checkout</h2><Button variant="hero" onClick={() => navigate('/marketplace')}>Browse Marketplace</Button></div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><h1 className="font-display text-3xl font-bold mb-6"><span className="gradient-text">Checkout</span></h1></motion.div>

        <div className="space-y-6">
          <Card className="gradient-card border-border/50">
            <CardHeader><CardTitle className="font-display">Shipping Address</CardTitle></CardHeader>
            <CardContent><Input placeholder="Enter delivery address..." value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="h-12" /></CardContent>
          </Card>

          <Card className="gradient-card border-border/50">
            <CardHeader><CardTitle className="font-display">Payment Method</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="space-y-3">
                <Label htmlFor="pm-usdc" className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:border-primary/50 transition-colors"><RadioGroupItem value="usdc" id="pm-usdc" /><CreditCard className="w-5 h-5 text-primary" /><div><p className="font-medium">USDC</p><p className="text-xs text-muted-foreground">Primary stablecoin checkout</p></div></Label>
                <Label htmlFor="pm-avax" className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:border-primary/50 transition-colors"><RadioGroupItem value="avax" id="pm-avax" /><Coins className="w-5 h-5 text-primary" /><div><p className="font-medium">AVAX</p><p className="text-xs text-muted-foreground">Optional crypto payment</p></div></Label>
                <Label htmlFor="pm-mpesa" className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:border-primary/50 transition-colors"><RadioGroupItem value="mpesa" id="pm-mpesa" /><Smartphone className="w-5 h-5 text-success" /><div><p className="font-medium">Local mobile money</p><p className="text-xs text-muted-foreground">Use where supported</p></div></Label>
              </RadioGroup>

              {paymentMethod === 'mpesa' && <div className="mt-4"><Label className="text-sm font-medium">Phone Number</Label><Input placeholder="Your mobile money number" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" /></div>}
            </CardContent>
          </Card>

          <Card className="gradient-card border-border/50">
            <CardContent className="p-6 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm"><span className="text-muted-foreground">{item.product.name} × {item.quantity}</span><span className="font-medium">{(getItemPriceUsdc(item) * item.quantity).toFixed(2)} USDC</span></div>
              ))}
              <div className="border-t border-border/50 pt-3 flex justify-between text-lg font-display font-bold">
                <span>Total</span>
                <div className="text-right">
                  <p>{totalUsdc.toFixed(2)} USDC</p>
                  {rates && <p className="text-sm text-muted-foreground font-normal">≈ {formatLocalCurrency(totalLocal, selectedCountry)}</p>}
                </div>
              </div>
              <Button variant="hero" className="w-full" size="lg" onClick={handleCheckout} disabled={isSubmitting}>{isSubmitting ? 'Processing...' : 'Place Order'}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
