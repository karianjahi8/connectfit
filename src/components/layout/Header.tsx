import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, User, MessageCircle, Building2, ShoppingBag, ShoppingCart, Store, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { AuthButton } from '@/components/web3/AuthButton';
import { EASE } from '@/components/motion/primitives';

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn(
        'fixed left-0 right-0 top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300',
        scrolled
          ? 'border-border bg-background/95 backdrop-blur-md shadow-[0_10px_30px_-24px_hsl(var(--foreground)/0.4)]'
          : 'border-border/60 bg-background/70 backdrop-blur-sm',
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <img
              src="/fitconnect-icon.png"
              alt="FitConnect"
              className="h-10 w-10 rounded-sm transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden flex-col leading-none sm:flex">
              <span className="eyebrow">FITCONNECT</span>
              <span className="font-display text-base font-bold text-foreground">Borderless Fitness</span>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden items-center gap-1 xl:flex">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link key={to} to={to} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-accent/15"
                      transition={{ duration: 0.35, ease: EASE }}
                    />
                  )}
                  <Button
                    variant="ghost"
                    className={cn('relative gap-2 rounded-full font-medium', isActive && 'text-accent')}
                  >
                    <Icon className="h-4 w-4" />
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
                <Store className="h-4 w-4" />
                Sell
              </Button>
            </Link>
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="absolute -right-1 -top-1"
                  >
                    <Badge className="flex h-5 w-5 items-center justify-center p-0 text-[10px]">
                      {cartCount}
                    </Badge>
                  </motion.span>
                )}
              </Button>
            </Link>
            <AuthButton />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="border-t border-border/50 bg-background/95 backdrop-blur-sm xl:hidden">
        <div className="grid grid-cols-7 py-1.5">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'relative flex min-w-0 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 transition-colors active:scale-95',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="max-w-full truncate text-[10px] font-medium">{label}</span>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-mobile"
                    className="absolute -bottom-0.5 h-0.5 w-6 rounded-full bg-primary"
                    transition={{ duration: 0.3, ease: EASE }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </motion.header>
  );
}
