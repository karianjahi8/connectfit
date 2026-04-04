import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, LogOut, Key } from 'lucide-react';

export function WalletPanel() {
  const { logout, exportWallet } = useAuth();
  const {
    hasEmbeddedWallet,
    displayIdentity,
    shortAddress,
    usdcBalance,
    usdtBalance,
    avaxBalance,
    isCorrectChain,
    switchToAvalanche,
  } = useWallet();

  return (
    <Card className="gradient-card border-border/50">
      <CardContent className="p-4 space-y-4">
        {/* Identity row */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
            {displayIdentity?.[0]?.toUpperCase() ?? 'F'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{displayIdentity}</p>
            {hasEmbeddedWallet ? (
              <Badge variant="outline" className="text-xs">FitConnect Wallet</Badge>
            ) : (
              <Badge variant="outline" className="text-xs">External Wallet</Badge>
            )}
          </div>
        </div>

        {/* Wrong network warning */}
        {!isCorrectChain && (
          <Button variant="destructive" size="sm" className="w-full gap-2" onClick={switchToAvalanche}>
            <AlertTriangle className="w-4 h-4" />
            Connection issue — fixing automatically...
          </Button>
        )}

        {/* Balances */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Available balance</span>
            <span className="font-bold">${usdcBalance}</span>
          </div>

          {!hasEmbeddedWallet && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">USDT</span>
                <span>${usdtBalance}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">AVAX</span>
                <span>{avaxBalance}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Address</span>
                <span className="font-mono text-xs">{shortAddress}</span>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {hasEmbeddedWallet && (
            <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => exportWallet()}>
              <Key className="w-3 h-3" />
              Export wallet
            </Button>
          )}
          <Button variant="ghost" size="sm" className="flex-1 gap-1" onClick={logout}>
            <LogOut className="w-3 h-3" />
            Sign out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
