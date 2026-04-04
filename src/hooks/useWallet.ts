import { useWallets } from '@privy-io/react-auth';
import {
  useAccount,
  useBalance,
  useReadContract,
  useSwitchChain,
} from 'wagmi';
import { formatUnits } from 'viem';
import { avalanche } from 'viem/chains';
import { useAuth } from './useAuth';
import {
  USDC_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
  ERC20_ABI,
} from '@/lib/web3/contracts';

export function useWallet() {
  const { isAuthenticated, hasEmbeddedWallet, displayIdentity } = useAuth();
  const { wallets } = useWallets();
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();

  const isCorrectChain = chain?.id === avalanche.id;

  const { data: avaxBalance } = useBalance({
    address,
    query: { enabled: !!address },
  });

  const { data: usdcRaw } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: usdtRaw } = useReadContract({
    address: USDT_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const usdcBalance = usdcRaw
    ? Number(formatUnits(usdcRaw as bigint, 6)).toFixed(2)
    : '0.00';
  const usdtBalance = usdtRaw
    ? Number(formatUnits(usdtRaw as bigint, 6)).toFixed(2)
    : '0.00';
  const avaxFormatted = avaxBalance
    ? Number(avaxBalance.formatted).toFixed(4)
    : '0.0000';

  const shortAddress = address
    ? address.slice(0, 6) + '...' + address.slice(-4)
    : null;

  return {
    isConnected: isAuthenticated,
    hasEmbeddedWallet,
    address,
    shortAddress,
    displayIdentity,
    chain,
    isCorrectChain,
    usdcBalance,
    usdtBalance,
    avaxBalance: avaxFormatted,
    wallets,
    switchToAvalanche: () => switchChain({ chainId: avalanche.id }),
  };
}
