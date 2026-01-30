import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, DollarSign, Smartphone, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatKES, convertToKES, type ExchangeRates } from '@/hooks/useExchangeRates';

export type PaymentMethod = 'AVAX' | 'USDC' | 'MPESA';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  amount: number; // Amount in AVAX (base currency for trainer rates)
  rates: ExchangeRates;
}

const paymentMethods = [
  {
    id: 'AVAX' as PaymentMethod,
    name: 'AVAX',
    description: 'Native Avalanche token',
    icon: Wallet,
    available: true,
    color: 'text-[#E84142]',
    bgColor: 'bg-[#E84142]/10',
  },
  {
    id: 'USDC' as PaymentMethod,
    name: 'USDC',
    description: 'USD Stablecoin',
    icon: DollarSign,
    available: true,
    color: 'text-[#2775CA]',
    bgColor: 'bg-[#2775CA]/10',
  },
  {
    id: 'MPESA' as PaymentMethod,
    name: 'M-Pesa',
    description: 'Mobile money',
    icon: Smartphone,
    available: false,
    color: 'text-[#00A651]',
    bgColor: 'bg-[#00A651]/10',
  },
];

export function PaymentMethodSelector({
  selected,
  onSelect,
  amount,
  rates,
}: PaymentMethodSelectorProps) {
  // Convert AVAX amount to other currencies
  const avaxInKes = convertToKES(amount, 'AVAX', rates);
  const usdcAmount = (amount * rates.avaxToUsd) / rates.usdcToUsd;
  const usdcInKes = convertToKES(usdcAmount, 'USDC', rates);

  const getAmountForMethod = (method: PaymentMethod) => {
    switch (method) {
      case 'AVAX':
        return { crypto: `${amount} AVAX`, kes: formatKES(avaxInKes) };
      case 'USDC':
        return { crypto: `${usdcAmount.toFixed(2)} USDC`, kes: formatKES(usdcInKes) };
      case 'MPESA':
        return { crypto: null, kes: formatKES(avaxInKes) };
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Payment Method</label>
      <div className="grid gap-2">
        {paymentMethods.map((method) => {
          const amounts = getAmountForMethod(method.id);
          const isSelected = selected === method.id;
          const Icon = method.icon;

          return (
            <Card
              key={method.id}
              className={cn(
                'cursor-pointer transition-all border-2',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border/50 hover:border-primary/30',
                !method.available && 'opacity-60 cursor-not-allowed'
              )}
              onClick={() => method.available && onSelect(method.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', method.bgColor)}>
                      <Icon className={cn('w-5 h-5', method.color)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{method.name}</span>
                        {!method.available && (
                          <Badge variant="outline" className="text-xs">
                            Coming Soon
                          </Badge>
                        )}
                        {isSelected && method.available && (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {amounts.crypto && (
                      <p className="font-semibold text-sm">{amounts.crypto}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{amounts.kes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
