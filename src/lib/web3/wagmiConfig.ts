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

// Contract addresses
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
