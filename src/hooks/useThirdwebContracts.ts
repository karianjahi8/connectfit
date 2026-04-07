import { useMemo } from 'react';
import { getBookingEscrowContract, getTrainerRegistryContract } from '@/lib/web3/thirdwebContracts';
import { areContractsDeployed } from '@/lib/web3/wagmiConfig';

type Network = 'fuji' | 'mainnet';

/**
 * Hook to access thirdweb contract instances for BookingEscrow and TrainerRegistry.
 * Returns null contracts when addresses are still placeholder (0x000...).
 */
export function useThirdwebContracts(network: Network = 'fuji') {
  const deployed = areContractsDeployed(network);

  const bookingEscrow = useMemo(
    () => (deployed ? getBookingEscrowContract(network) : null),
    [deployed, network]
  );

  const trainerRegistry = useMemo(
    () => (deployed ? getTrainerRegistryContract(network) : null),
    [deployed, network]
  );

  return {
    bookingEscrow,
    trainerRegistry,
    areContractsDeployed: deployed,
  };
}
