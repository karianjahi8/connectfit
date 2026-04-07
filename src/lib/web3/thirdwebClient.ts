import { createThirdwebClient } from 'thirdweb';

/**
 * Thirdweb client for smart contract interactions.
 * Client ID is a publishable key — safe for frontend use.
 */
export const thirdwebClient = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || '1ce2f04d519205dc3b349c219b0a46c3',
});
