import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import {
  metaMaskWallet,
  coreWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

// WalletConnect Cloud Project ID - Required for mobile wallet connections
// Get your own at https://cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '89e2593e6c2f22482e1d8a785e0d3eb0';

// Configure chains - Avalanche Fuji testnet for development
export const config = getDefaultConfig({
  appName: 'FitConnect',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [avalancheFuji, avalanche],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        coreWallet,
        metaMaskWallet,
        walletConnectWallet, // Enables QR code scanning for mobile
      ],
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
