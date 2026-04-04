import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAuth() {
  const {
    ready,
    authenticated,
    user,
    login,
    logout,
    linkEmail,
    linkGoogle,
    linkPhone,
    linkWallet,
    exportWallet,
  } = usePrivy();

  // Sync Privy user identity to Supabase profiles table
  useEffect(() => {
    if (!ready || !authenticated || !user) return;

    const syncProfile = async () => {
      const walletAddress = user.wallet?.address ?? null;
      const email =
        user.email?.address ??
        user.google?.email ??
        user.apple?.email ??
        null;
      const displayName =
        user.google?.name ??
        user.apple?.name ??
        email?.split('@')[0] ??
        (walletAddress
          ? walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4)
          : 'FitConnect User');
      const avatarUrl = user.google?.picture ?? null;

      await supabase.from('profiles').upsert(
        {
          id: user.id,
          wallet_address: walletAddress,
          full_name: displayName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    };

    syncProfile();
  }, [ready, authenticated, user]);

  const displayIdentity =
    user?.email?.address ??
    user?.google?.email ??
    user?.apple?.email ??
    user?.phone?.number ??
    (user?.wallet?.address
      ? user.wallet.address.slice(0, 6) + '...' + user.wallet.address.slice(-4)
      : null);

  const hasEmbeddedWallet =
    user?.linkedAccounts?.some(
      (a: any) => a.type === 'wallet' && a.walletClientType === 'privy'
    ) ?? false;

  return {
    isReady: ready,
    isAuthenticated: authenticated,
    user,
    displayIdentity,
    hasEmbeddedWallet,
    login,
    logout,
    linkEmail,
    linkGoogle,
    linkPhone,
    linkWallet,
    exportWallet,
    // Backwards compatibility
    loading: !ready,
    session: authenticated ? { user } : null,
    signUp: async () => { login(); return { error: null }; },
    signIn: async () => { login(); return { error: null }; },
    signOut: logout,
  };
}
