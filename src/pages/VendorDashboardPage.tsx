import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Store, Plus, Package, CheckCircle, Clock, XCircle, Shield, Globe, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COUNTRIES, getCountryName } from '@/lib/countries';
import { useSelectedCountry } from '@/hooks/useSelectedCountry';

export default function VendorDashboardPage() {
  const { user } = useAuth();
  const { selectedCountry } = useSelectedCountry();
  const queryClient = useQueryClient();

  const { data: vendor, isLoading: vendorLoading } = useQuery({
    queryKey: ['vendor', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from('vendors').select('*').eq('user_id', user!.id).maybeSingle();
      return data;
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ['vendor-products', vendor?.id],
    enabled: !!vendor,
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('vendor_id', vendor!.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['vendor-orders', vendor?.id],
    enabled: !!vendor,
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*, order_items(*, products:product_id(name))').eq('vendor_id', vendor!.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  if (!user) {
    return <Layout><div className="container mx-auto px-4 py-16 text-center"><Store className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" /><h2 className="font-display text-2xl font-bold mb-2">Sign in to manage your store</h2><Link to="/auth"><Button variant="hero">Sign In</Button></Link></div></Layout>;
  }

  if (vendorLoading) {
    return <Layout><div className="container mx-auto px-4 py-8"><div className="h-40 rounded-xl bg-muted animate-pulse" /></div></Layout>;
  }

  if (!vendor) {
    return <VendorRegistration userId={user.id} />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1"><Store className="inline-block w-8 h-8 mr-2 -mt-1" />{vendor.business_name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <VendorStatusBadge status={vendor.status} />
                {vendor.onchain_verified && <Badge className="gap-1 bg-success/10 text-success border-success/20"><Shield className="w-3 h-3" /> On-chain Verified</Badge>}
                {vendor.country && <Badge variant="outline" className="gap-1"><Globe className="w-3 h-3" />{getCountryName(vendor.country)}</Badge>}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="gradient-card border-border/50"><CardContent className="p-6 text-center"><Package className="w-8 h-8 text-primary mx-auto mb-2" /><p className="text-2xl font-display font-bold">{products.length}</p><p className="text-sm text-muted-foreground">Products</p></CardContent></Card>
          <Card className="gradient-card border-border/50"><CardContent className="p-6 text-center"><Store className="w-8 h-8 text-success mx-auto mb-2" /><p className="text-2xl font-display font-bold">{orders.length}</p><p className="text-sm text-muted-foreground">Orders</p></CardContent></Card>
          <Card className="gradient-card border-border/50"><CardContent className="p-6 text-center"><CheckCircle className="w-8 h-8 text-warning mx-auto mb-2" /><p className="text-2xl font-display font-bold">{orders.filter((o: any) => o.status === 'delivered').length}</p><p className="text-sm text-muted-foreground">Completed</p></CardContent></Card>
        </div>

        {vendor.status === 'pending' && <Card className="gradient-card border-warning/30 mb-8"><CardContent className="p-6 flex items-center gap-4"><Clock className="w-8 h-8 text-warning shrink-0" /><div><h3 className="font-display font-semibold">Verification Pending</h3><p className="text-sm text-muted-foreground">Your merchant profile is being reviewed. You can add products now and publish globally once approved.</p></div></CardContent></Card>}

        <AddProductForm vendorId={vendor.id} />

        <div className="mt-8">
          <h2 className="font-display text-xl font-bold mb-4">Your Products</h2>
          {products.length === 0 ? (
            <Card className="gradient-card border-border/50"><CardContent className="p-8 text-center text-muted-foreground">No products yet. Add your first product above!</CardContent></Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product: any) => (
                <Card key={product.id} className="gradient-card border-border/50">
                  <CardContent className="p-4">
                    <div className="aspect-video rounded-lg bg-muted mb-3 overflow-hidden">
                      {product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-muted-foreground/30" /></div>}
                    </div>
                    <h3 className="font-display font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                    <p className="font-display font-bold mt-1">{(product.price_usdc ?? 0).toFixed(2)} USDC</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function VendorStatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: any; className: string; label: string }> = {
    pending: { icon: Clock, className: 'bg-warning/10 text-warning border-warning/20', label: 'Pending' },
    verified: { icon: CheckCircle, className: 'bg-success/10 text-success border-success/20', label: 'Verified' },
    rejected: { icon: XCircle, className: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Rejected' },
    suspended: { icon: XCircle, className: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Suspended' },
  };
  const c = config[status] || config.pending;
  const Icon = c.icon;
  return <Badge className={`gap-1 ${c.className}`}><Icon className="w-3 h-3" />{c.label}</Badge>;
}

function VendorRegistration({ userId }: { userId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedCountry, setSelectedCountry } = useSelectedCountry();
  const [form, setForm] = useState({ businessName: '', description: '', location: '', city: '', walletAddress: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName.trim()) {
      toast({ title: 'Business name required', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('vendors').insert({
        user_id: userId,
        business_name: form.businessName,
        description: form.description,
        location: form.location,
        wallet_address: form.walletAddress,
        phone: form.phone,
        country: selectedCountry,
        city: form.city,
      });
      if (error) throw error;
      toast({ title: 'Merchant registration submitted!', description: 'Your account is pending verification.' });
      queryClient.invalidateQueries({ queryKey: ['vendor'] });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-2">Become a <span className="gradient-text">Merchant</span></h1>
          <p className="text-muted-foreground mb-8">Register your fitness business and start selling globally on FitConnect.</p>
        </motion.div>

        <Card className="gradient-card border-border/50">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Business Name *</Label><Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="e.g. FitGear Global" className="mt-1" /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your products..." className="mt-1" /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Country</Label><Select value={selectedCountry} onValueChange={setSelectedCountry}><SelectTrigger className="mt-1"><SelectValue placeholder="Select country" /></SelectTrigger><SelectContent>{COUNTRIES.map((country) => <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Your city" className="mt-1" /></div>
              </div>
              <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Neighbourhood or address" className="mt-1" /></div>
              <div><Label>Wallet Address</Label><Input value={form.walletAddress} onChange={(e) => setForm({ ...form, walletAddress: e.target.value })} placeholder="0x..." className="mt-1" /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Business contact number" className="mt-1" /></div>
              <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Register as Merchant'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function AddProductForm({ vendorId }: { vendorId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: 'equipment' as string, priceUsdc: '', stock: '', imageUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.priceUsdc) {
      toast({ title: 'Name and price required', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('products').insert({
        vendor_id: vendorId,
        name: form.name,
        description: form.description,
        category: form.category as any,
        price_usdc: parseFloat(form.priceUsdc),
        stock: parseInt(form.stock) || 0,
        images: form.imageUrl ? [form.imageUrl] : [],
      });
      if (error) throw error;
      toast({ title: 'Product added!' });
      setForm({ name: '', description: '', category: 'equipment', priceUsdc: '', stock: '', imageUrl: '' });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) {
    return <Button variant="hero" className="gap-2" onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> Add Product</Button>;
  }

  return (
    <Card className="gradient-card border-primary/20">
      <CardHeader><CardTitle className="font-display">Add New Product</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Product Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Resistance Bands" className="mt-1" /></div>
            <div><Label>Category</Label><Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="gym_wear">Gym Wear</SelectItem><SelectItem value="equipment">Equipment</SelectItem><SelectItem value="supplements">Supplements</SelectItem><SelectItem value="accessories">Accessories</SelectItem></SelectContent></Select></div>
          </div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" /></div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div><Label>Price (USDC) *</Label><Input type="number" step="0.01" value={form.priceUsdc} onChange={(e) => setForm({ ...form, priceUsdc: e.target.value })} className="mt-1" /></div>
            <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="mt-1" /></div>
            <div><Label>Image URL</Label><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." className="mt-1" /></div>
          </div>
          <div className="flex gap-3"><Button type="submit" variant="hero" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Product'}</Button><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button></div>
        </form>
      </CardContent>
    </Card>
  );
}
