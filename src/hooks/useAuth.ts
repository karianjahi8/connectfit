import { getAccessToken, usePrivy } from '@privy-io/react-auth';
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

  // Sync Privy identity into profiles via the secure edge function.
  useEffect(() => {
    if (!ready || !authenticated || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const walletAddress = user.wallet?.address ?? null;
        const email =
          user.email?.address ?? user.google?.email ?? user.apple?.email ?? null;
        const displayName =
          (user.google as any)?.name ??
          email?.split('@')[0] ??
          (walletAddress
            ? walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4)
            : 'FitConnect User');
        const token = await getAccessToken();
        if (cancelled || !token) return;
        await supabase.functions.invoke('profile-rpc', {
          body: { action: 'save', full_name: displayName, email },
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.warn('profile sync failed', e);
      }
    })();
    return () => { cancelled = true; };
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
