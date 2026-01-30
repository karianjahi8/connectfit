import { useExchangeRates, formatKES, convertToKES } from '@/hooks/useExchangeRates';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  amount: number;
  currency?: 'AVAX' | 'USDC';
  showKES?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceDisplay({
  amount,
  currency = 'AVAX',
  showKES = true,
  className,
  size = 'md',
}: PriceDisplayProps) {
  const { data: rates } = useExchangeRates();

  const kesAmount = rates ? convertToKES(amount, currency, rates) : 0;

  const sizeClasses = {
    sm: {
      crypto: 'text-sm font-medium',
      kes: 'text-xs',
    },
    md: {
      crypto: 'text-base font-semibold',
      kes: 'text-sm',
    },
    lg: {
      crypto: 'text-lg font-bold',
      kes: 'text-sm',
    },
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <span className={cn(sizeClasses[size].crypto)}>
        {amount} {currency}
      </span>
      {showKES && rates && (
        <span className={cn('text-muted-foreground', sizeClasses[size].kes)}>
          ≈ {formatKES(kesAmount)}
        </span>
      )}
    </div>
  );
}

interface PriceInlineProps {
  amount: number;
  currency?: 'AVAX' | 'USDC';
  showKES?: boolean;
  className?: string;
}

export function PriceInline({
  amount,
  currency = 'AVAX',
  showKES = true,
  className,
}: PriceInlineProps) {
  const { data: rates } = useExchangeRates();

  const kesAmount = rates ? convertToKES(amount, currency, rates) : 0;

  return (
    <span className={cn('inline-flex items-baseline gap-1.5', className)}>
      <span className="font-semibold">
        {amount} {currency}
      </span>
      {showKES && rates && (
        <span className="text-sm text-muted-foreground">
          ({formatKES(kesAmount)})
        </span>
      )}
    </span>
  );
}
