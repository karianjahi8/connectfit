import type { PrivyClientConfig } from '@privy-io/react-auth';
import { avalanche, avalancheFuji } from 'viem/chains';

export const privyConfig: PrivyClientConfig = {
  loginMethods: ['email', 'google', 'apple', 'sms', 'wallet'],

  appearance: {
    theme: 'dark',
    accentColor: '#00E5A0',
    logo: '/fitconnect-logo.png',
    showWalletLoginFirst: false,
    landingHeader: 'Welcome to FitConnect',
    loginMessage: 'Sign in to book trainers, join clubs, and shop fitness gear worldwide.',
    walletChainType: 'ethereum-only',
  },

  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets',
    },
    showWalletUIs: true,
  },

  defaultChain: avalanche,
  supportedChains: [avalanche, avalancheFuji],
  mfa: { noPromptOnMfaRequired: false },
};
