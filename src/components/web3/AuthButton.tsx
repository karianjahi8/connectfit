import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function AuthButton() {
  const { isAuthenticated, login, logout } = useAuth();
  const { displayIdentity, usdcBalance } = useWallet();

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="wallet" size="default" className="gap-2">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">{displayIdentity}</span>
          <span className="text-muted-foreground text-xs hidden sm:inline">
            ${usdcBalance}
          </span>
        </Button>
        <Button variant="ghost" size="icon" onClick={logout} title="Sign out">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={login} variant="hero" size="default">
      Get Started
    </Button>
  );
}
