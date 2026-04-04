import { useFundWallet } from '@privy-io/react-auth';
import { avalanche } from 'viem/chains';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

interface FundWalletPromptProps {
  requiredAmount: number;
  onCancel: () => void;
}

export function FundWalletPrompt({ requiredAmount, onCancel }: FundWalletPromptProps) {
  const { fundWallet } = useFundWallet();
  const { address } = useWallet();

  const handleAddFunds = async () => {
    if (!address) return;
    await fundWallet(address, {
      chain: avalanche,
      asset: 'USDC',
      amount: String((requiredAmount + 2).toFixed(2)),
    });
  };

  return (
    <Card className="gradient-card border-primary/20">
      <CardContent className="p-6 text-center space-y-4">
        <CreditCard className="w-12 h-12 text-primary mx-auto" />
        <h3 className="font-display text-lg font-bold">Add funds to continue</h3>
        <p className="text-sm text-muted-foreground">
          You need ${requiredAmount.toFixed(2)} to complete this payment.
          Add funds instantly with your debit or credit card.
        </p>
        <div className="flex flex-col gap-2">
          <Button variant="hero" onClick={handleAddFunds} className="w-full">
            Add ${(requiredAmount + 2).toFixed(2)} with card
          </Button>
          <Button variant="outline" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
