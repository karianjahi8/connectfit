import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import {
  metaMaskWallet,
  coreWallet,
} from '@rainbow-me/rainbowkit/wallets';

// Configure chains - Avalanche Fuji testnet for development
export const config = getDefaultConfig({
  appName: 'FitConnect',
  projectId: 'fitconnect-demo', // Replace with actual WalletConnect project ID for production
  chains: [avalancheFuji, avalanche],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [coreWallet, metaMaskWallet],
    },
  ],
});

// Contract addresses - deploy these via Hardhat and update
export const CONTRACTS = {
  // Fuji Testnet addresses (update after deployment)
  fuji: {
    bookingEscrow: '0x0000000000000000000000000000000000000000',
    trainerRegistry: '0x0000000000000000000000000000000000000000',
  },
  // Mainnet addresses
  mainnet: {
    bookingEscrow: '0x0000000000000000000000000000000000000000',
    trainerRegistry: '0x0000000000000000000000000000000000000000',
  },
} as const;

// Platform configuration
export const PLATFORM_CONFIG = {
  platformFeePercent: 15, // 15% platform commission
  minBookingPrice: 0.01, // Minimum 0.01 AVAX
  cancellationFeePercent: 10, // 10% if cancelled within 24h
} as const;
