import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, User, MessageCircle, Building2, ShoppingBag, ShoppingCart, Store, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { AuthButton } from '@/components/web3/AuthButton';

const navLinks = [
  { to: '/trainers', label: 'Trainers', icon: Search },
  { to: '/marketplace', label: 'Market', icon: ShoppingBag },
  { to: '/clubs', label: 'Clubs', icon: Building2 },
  { to: '/activity', label: 'Activity', icon: Activity },
  { to: '/bookings', label: 'Bookings', icon: Calendar },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
  { to: '/profile', label: 'Profile', icon: User },
];

export function Header() {
  const location = useLocation();
  const { cartCount } = useCart();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-accent/15"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/fitconnect-icon.png"
                alt="FitConnect"
                className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 rounded-xl shadow-glow opacity-70 pointer-events-none group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="eyebrow">FITCONNECT</span>
              <span className="font-display font-bold text-base text-foreground">Borderless Fitness</span>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link key={to} to={to}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'gap-2 font-medium rounded-full',
                      isActive && 'bg-accent/15 text-accent'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Auth & Cart */}
          <div className="flex items-center gap-1 sm:gap-3">
            <Link to="/vendor" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Store className="w-4 h-4" />
                Sell
              </Button>
            </Link>
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] gradient-primary text-primary-foreground">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <AuthButton />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="xl:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="grid grid-cols-7 py-1.5">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-lg transition-colors min-w-0',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[10px] font-medium truncate max-w-full">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </motion.header>
  );
}
