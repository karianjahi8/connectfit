import { createConfig, http } from 'wagmi';
import { avalanche, avalancheFuji } from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [avalanche, avalancheFuji],
  transports: {
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
    [avalancheFuji.id]: http('https://api.avax-test.network/ext/bc/C/rpc'),
  },
});

// Platform configuration
export const PLATFORM_CONFIG = {
  platformFeePercent: 15,
  minBookingPrice: 0.01,
  cancellationFeePercent: 10,
} as const;

// Contract addresses — replace with real deployed addresses before production
export const CONTRACTS = {
  fuji: {
    bookingEscrow: '0x0000000000000000000000000000000000000000',
    trainerRegistry: '0x0000000000000000000000000000000000000000',
  },
  mainnet: {
    bookingEscrow: '0x0000000000000000000000000000000000000000',
    trainerRegistry: '0x0000000000000000000000000000000000000000',
  },
} as const;

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * Returns true if contracts are deployed (not zero-address placeholders).
 * UI must check this before allowing any on-chain transaction.
 */
export function areContractsDeployed(network: 'fuji' | 'mainnet' = 'fuji'): boolean {
  const addrs = CONTRACTS[network];
  return addrs.bookingEscrow !== ZERO_ADDRESS && addrs.trainerRegistry !== ZERO_ADDRESS;
}

/**
 * Throws if contracts haven't been deployed yet — call before signing any tx.
 */
export function requireDeployedContracts(network: 'fuji' | 'mainnet' = 'fuji'): void {
  if (!areContractsDeployed(network)) {
    throw new Error(
      'Smart contracts are not yet deployed. On-chain payments are unavailable until contracts are deployed to Avalanche.'
    );
  }
}
